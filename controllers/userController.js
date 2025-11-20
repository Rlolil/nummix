import User from "../models/User.js";
import bcrypt from "bcryptjs";
import taxCalculationService from "../services/taxCalculationService.js";

// ✅ Yeni istifadəçi qeydiyyatı
export const registerUser = async (req, res) => {
  try {
    const { fullName, companyName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Bu email artıq istifadə olunub" });
    }

    const user = await User.create({ fullName, companyName, email, password });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ İstifadəçi girişi
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email və ya şifrə səhvdir" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email və ya şifrə səhvdir" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Bütün istifadəçiləri getir
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ID ilə istifadəçi getir
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ İstifadəçi məlumatlarını yenilə
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // Şifrə varsa, hash et
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ İstifadəçini sil
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }
    res.json({ message: "İstifadəçi silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== 💰 YENİ VERGİ VƏ ÖDƏNİŞ FUNKSİYALARI =====================

// ✅ Əməkhaqqı fondu yenilə
export const updateSalaryFund = async (req, res) => {
  try {
    const { month, amount } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    if (!user.monthly_total_salary_fund[month]) {
      return res.status(400).json({ message: "Yanlış ay adı" });
    }

    // Əməkhaqqı fondu yenilə
    user.monthly_total_salary_fund[month] = amount;

    // Şirkət vergilərini avtomatik hesabla
    const companyTaxes = taxCalculationService.calculateStateEmployerTaxes(amount);
    user.company_taxes.dsmf[month] = companyTaxes.employerTaxes.dsmf;
    user.company_taxes.ish[month] = companyTaxes.employerTaxes.ish;
    user.company_taxes.its[month] = companyTaxes.employerTaxes.its;
    user.company_taxes.total_company_taxes[month] = companyTaxes.totalEmployerTaxes;

    // Cari ay ümumi məlumatları yenilə
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    if (month === currentMonth) {
      user.current_month_total.salary_fund = amount;
      user.current_month_total.company_taxes = companyTaxes.totalEmployerTaxes;
    }

    await user.save();

    res.json({
      salary_fund: user.monthly_total_salary_fund[month],
      company_taxes: {
        dsmf: user.company_taxes.dsmf[month],
        ish: user.company_taxes.ish[month],
        its: user.company_taxes.its[month],
        total: user.company_taxes.total_company_taxes[month]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Şirkət vergilərini yenilə
export const updateCompanyTaxes = async (req, res) => {
  try {
    const { month, dsmf, ish, its } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    if (!user.company_taxes.dsmf[month]) {
      return res.status(400).json({ message: "Yanlış ay adı" });
    }

    // Vergiləri yenilə
    user.company_taxes.dsmf[month] = dsmf || user.company_taxes.dsmf[month];
    user.company_taxes.ish[month] = ish || user.company_taxes.ish[month];
    user.company_taxes.its[month] = its || user.company_taxes.its[month];
    
    // Ümumi vergi hesabla
    user.company_taxes.total_company_taxes[month] = 
      user.company_taxes.dsmf[month] + 
      user.company_taxes.ish[month] + 
      user.company_taxes.its[month];

    await user.save();

    res.json(user.company_taxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ İşçi axını məlumatlarını gətir
export const getEmployeeFlowData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("monthly_employee_flow employee_flow_history");
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json({
      monthly_stats: user.monthly_employee_flow,
      history: user.employee_flow_history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ İşçi axını məlumatlarını yenilə
export const updateEmployeeFlowData = async (req, res) => {
  try {
    const { month, type, count, employeeData } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    if (month && type) {
      // Aylıq statistikaları yenilə
      if (type === 'new_hires') {
        user.monthly_employee_flow[month].new_hires += count;
        user.monthly_employee_flow[month].net_change += count;
      } else if (type === 'terminations') {
        user.monthly_employee_flow[month].terminations += count;
        user.monthly_employee_flow[month].net_change -= count;
      } else if (type === 'resignations') {
        user.monthly_employee_flow[month].resignations += count;
        user.monthly_employee_flow[month].net_change -= count;
      }
    }

    if (employeeData) {
      // Tarixçəyə yeni qeyd əlavə et
      user.employee_flow_history.push(employeeData);
    }

    await user.save();

    res.json({
      monthly_stats: user.monthly_employee_flow,
      history: user.employee_flow_history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Ödəniş ümumi baxışını gətir
export const getPaymentOverview = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("employee_payments employer_payments current_month_total");
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Ödəniş statistikalarını hesabla
    const totalEmployeePayments = user.employee_payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalEmployerPayments = user.employer_payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = user.employee_payments.filter(p => p.status === 'completed').length;
    const pendingPayments = user.employee_payments.filter(p => p.status === 'pending').length;

    res.json({
      summary: {
        total_employee_payments: totalEmployeePayments,
        total_employer_payments: totalEmployerPayments,
        total_payments: totalEmployeePayments + totalEmployerPayments,
        completed_payments: completedPayments,
        pending_payments: pendingPayments,
        payment_success_rate: user.employee_payments.length > 0 ? 
          (completedPayments / user.employee_payments.length * 100).toFixed(2) : 0
      },
      current_month: user.current_month_total,
      recent_employee_payments: user.employee_payments.slice(-5).reverse(),
      recent_employer_payments: user.employer_payments.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== 📅 MÖVCUD TƏQVİM FUNKSİYALARI =====================

// ✅ Təqvim günü əlavə et
export const addCalendarDay = async (req, res) => {
  try {
    const { date, dayOfWeek, status, events, note } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Eyni tarixli gün varmı yoxla
    const existingDay = user.calendar.find(day => 
      new Date(day.date).toDateString() === new Date(date).toDateString()
    );

    if (existingDay) {
      return res.status(400).json({ message: "Bu tarix üçün gün artıq mövcuddur" });
    }

    user.calendar.push({ date, dayOfWeek, status, events, note });
    await user.save();

    res.json(user.calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCalendar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user.calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCalendarDayById = async (req, res) => {
  try {
    const { id, dayId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const calendarDay = user.calendar.id(dayId);
    if (!calendarDay) {
      return res.status(404).json({ message: "Calendar günü tapılmadı" });
    }

    res.json(calendarDay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Təqvim gününü yenilə
export const updateCalendarDay = async (req, res) => {
  try {
    const { dayId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const dayIndex = user.calendar.id(dayId);
    if (!dayIndex) {
      return res.status(404).json({ message: "Gün tapılmadı" });
    }

    Object.assign(dayIndex, updateData);
    await user.save();

    res.json(user.calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Təqvim gününü sil
export const deleteCalendarDay = async (req, res) => {
  try {
    const { dayId } = req.params;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    user.calendar.pull(dayId);
    await user.save();

    res.json({ message: "Gün silindi", calendar: user.calendar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== 🎯 MÖVCUD TƏDBİR FUNKSİYALARI =====================

// ✅ Tədbir əlavə et
export const addEvent = async (req, res) => {
  try {
    const { dayId } = req.params;
    const { title, description, startTime, endTime, location } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const day = user.calendar.id(dayId);
    if (!day) {
      return res.status(404).json({ message: "Gün tapılmadı" });
    }

    day.events.push({ title, description, startTime, endTime, location });
    await user.save();

    res.json(day.events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Tədbiri yenilə
export const updateEvent = async (req, res) => {
  try {
    const { dayId, eventId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const day = user.calendar.id(dayId);
    if (!day) {
      return res.status(404).json({ message: "Gün tapılmadı" });
    }

    const event = day.events.id(eventId);
    if (!event) {
      return res.status(404).json({ message: "Tədbir tapılmadı" });
    }

    Object.assign(event, updateData);
    await user.save();

    res.json(day.events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Tədbiri sil
export const deleteEvent = async (req, res) => {
  try {
    const { dayId, eventId } = req.params;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const day = user.calendar.id(dayId);
    if (!day) {
      return res.status(404).json({ message: "Gün tapılmadı" });
    }

    day.events.pull(eventId);
    await user.save();

    res.json({ message: "Tədbir silindi", events: day.events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id, dayId, eventId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const calendarDay = user.calendar.id(dayId);
    if (!calendarDay) {
      return res.status(404).json({ message: "Calendar günü tapılmadı" });
    }

    const event = calendarDay.events.id(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event tapılmadı" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { id, dayId, eventId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const calendarDay = user.calendar.id(dayId);
    if (!calendarDay) {
      return res.status(404).json({ message: "Calendar günü tapılmadı" });
    }
    
    res.json(calendarDay.events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== 💰 MÖVCUD MALİYYƏ FUNKSİYALARI =====================

// ✅ Maliyyə məlumatlarını yenilə
export const updateFinancialData = async (req, res) => {
  try {
    const financialData = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      financialData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Aylıq məlumatları yenilə
export const updateMonthlyData = async (req, res) => {
  try {
    const { month, dataType, value } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Aylıq məlumatları yenilə
    if (user[dataType] && user[dataType][month] !== undefined) {
      user[dataType][month] = value;
      await user.save();
    } else {
      return res.status(400).json({ message: "Yanlış data tipi və ya ay" });
    }

    res.json(user[dataType]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import AccountingService from "../services/accountingService.js";

// ✅ MÜHASİBAT YAZILIŞI ƏLAVƏ ET
export const addAccountingEntry = async (req, res) => {
  try {
    const { accountCode, amount, type, description, documentNumber, date } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Hesab məlumatlarını al
    const accountInfo = AccountingService.getAccountInfo(accountCode);
    if (!accountInfo) {
      return res.status(400).json({ message: "Yanlış hesab kodu" });
    }

    // Validation
    const validation = AccountingService.validateAccountingEntry({
      accountCode, amount, type, documentNumber
    });
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: "Validation xətası", 
        errors: validation.errors 
      });
    }

    const newEntry = {
      accountCode,
      accountName: accountInfo.name,
      amount,
      type,
      description,
      documentNumber,
      date: date || new Date(),
      status: 'posted'
    };

    user.accountingEntries.push(newEntry);
    
    // Aylıq statistikaları yenilə
    user.updateMonthlyAccounting(newEntry);
    
    await user.save();

    res.status(201).json({
      success: true,
      data: newEntry,
      message: "Mühasibat yazılışı uğurla əlavə edildi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ BÜTÜN MÜHASİBAT YAZILIŞLARINI GƏTİR
export const getAccountingEntries = async (req, res) => {
  try {
    const { startDate, endDate, accountCode, type } = req.query;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    let entries = user.accountingEntries;

    // Filterləmə
    if (startDate) {
      entries = entries.filter(entry => new Date(entry.date) >= new Date(startDate));
    }
    if (endDate) {
      entries = entries.filter(entry => new Date(entry.date) <= new Date(endDate));
    }
    if (accountCode) {
      entries = entries.filter(entry => entry.accountCode === accountCode);
    }
    if (type) {
      entries = entries.filter(entry => entry.type === type);
    }

    // Sıralama (ən yeni üstə)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: entries,
      count: entries.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MÜHASİBAT BALANSLARINI GƏTİR
export const getAccountingBalances = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Balansları yenilə
    user.updateAccountingBalances();
    await user.save();

    const balances = AccountingService.calculateAllBalances(user.accountingEntries);

    res.json({
      success: true,
      data: {
        balances: balances.balances,
        summary: balances.summary,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ HESAB KODU ÜZRƏ BALANS GƏTİR
export const getAccountBalance = async (req, res) => {
  try {
    const { accountCode } = req.params;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const accountInfo = AccountingService.getAccountInfo(accountCode);
    if (!accountInfo) {
      return res.status(404).json({ message: "Hesab kodu tapılmadı" });
    }

    const balance = AccountingService.calculateAccountBalance(user.accountingEntries, accountCode);

    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MÜHASİBAT HESABATI YARAT
export const generateAccountingReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const report = AccountingService.generateAccountingReport(
      user.accountingEntries, 
      startDate, 
      endDate
    );

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NÜMUNƏ MÜHASİBAT ƏMƏLİYYATI YARAT
export const createSampleAccountingTransaction = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const sampleEntries = AccountingService.createSampleTransaction();
    
    sampleEntries.forEach(entry => {
      user.accountingEntries.push(entry);
      user.updateMonthlyAccounting(entry);
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: sampleEntries,
      message: "Nümunə mühasibat əməliyyatı uğurla yaradıldı"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MÜHASİBAT YAZILIŞINI SİL
export const deleteAccountingEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const entryIndex = user.accountingEntries.findIndex(entry => entry._id.toString() === entryId);
    if (entryIndex === -1) {
      return res.status(404).json({ message: "Yazılış tapılmadı" });
    }

    user.accountingEntries.splice(entryIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: "Mühasibat yazılışı uğurla silindi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MÜHASİBAT YAZILIŞINI YENİLƏ
export const updateAccountingEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const entry = user.accountingEntries.id(entryId);
    if (!entry) {
      return res.status(404).json({ message: "Yazılış tapılmadı" });
    }

    Object.assign(entry, updateData);
    await user.save();

    res.json({
      success: true,
      data: entry,
      message: "Mühasibat yazılışı uğurla yeniləndi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};