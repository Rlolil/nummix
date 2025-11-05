import User from "../models/User.js";
import bcrypt from "bcryptjs";

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