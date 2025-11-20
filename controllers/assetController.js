import User from "../models/User.js";
import { ExcelService } from '../services/excelServices.js';
import { PdfService } from '../services/pdfService.js';
import fs from 'fs';
// 🏢 VƏSAİT ƏMƏLİYYATLARI
export const generateAndDownloadExcel = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const activeAssets = user.assets.filter(asset => asset.status === "Aktiv");
    
    // Excel faylı yarat
    const excelResult = await ExcelService.generateAssetsExcel(activeAssets, user);

    // Database-də qeyd et
    const excelReport = {
      title: "Ümumi hesabat",
      description: "Vəsait siyahısını Excel kimi yüklə",
      fileName: excelResult.fileName,
      filePath: excelResult.filePath,
      fileSize: excelResult.fileSize,
      generatedAt: new Date(),
      data: activeAssets.map(asset => ({
        inventoryNumber: asset.inventoryNumber,
        name: asset.name,
        category: asset.category,
        account: asset.account,
        location: asset.location,
        initialValue: asset.initialValue,
        currentValue: asset.currentValue,
        amortization: asset.amortization,
        status: asset.status
      }))
    };

    user.assetExcelReports.push(excelReport);
    await user.save();

    // Faylı yüklə
    res.download(excelResult.filePath, excelResult.fileName, (err) => {
      if (err) {
        console.error('Fayl yüklənərkən xəta:', err);
      }
      // Faylı silmək istəyirsinizsə:
      // fs.unlinkSync(excelResult.filePath);
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Excel faylı yaradılarkən xəta baş verdi',
      message: error.message 
    });
  }
};

// PDF hesabatı yarat və yüklə
export const generateAndDownloadPdf = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const activeAssets = user.assets.filter(asset => asset.status === "Aktiv");
    
    // PDF faylı yarat
    const pdfResult = await PdfService.generateAmortizationPdf(activeAssets, user);

    // Database-də qeyd et
    const pdfReport = {
      title: "Amortizasiya hesabatı",
      description: "Amortizasiya detalları",
      fileName: pdfResult.fileName,
      filePath: pdfResult.filePath,
      fileSize: pdfResult.fileSize,
      generatedAt: new Date(),
      data: activeAssets.map(asset => ({
        inventoryNumber: asset.inventoryNumber,
        name: asset.name,
        category: asset.category,
        initialValue: asset.initialValue,
        currentValue: asset.currentValue,
        amortization: asset.amortization,
        amortizationPercentage: asset.amortizationPercentage
      }))
    };

    user.assetPdfReports.push(pdfReport);
    await user.save();

    // Faylı yüklə
    res.download(pdfResult.filePath, pdfResult.fileName);

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'PDF faylı yaradılarkən xəta baş verdi',
      message: error.message 
    });
  }
};

// Kateqoriya üzrə Excel yüklə
export const downloadCategoryExcel = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const categoryReport = user.generateCategoryReport();
    const excelResult = await ExcelService.generateCategoryExcel(categoryReport, user);

    res.download(excelResult.filePath, excelResult.fileName);

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Kateqoriya Excel faylı yaradılarkən xəta baş verdi',
      message: error.message 
    });
  }
};

// Kateqoriya üzrə PDF yüklə
export const downloadCategoryPdf = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const categoryReport = user.generateCategoryReport();
    const pdfResult = await PdfService.generateCategoryPdf(categoryReport, user);

    res.download(pdfResult.filePath, pdfResult.fileName);

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Kateqoriya PDF faylı yaradılarkən xəta baş verdi',
      message: error.message 
    });
  }
};

// Əvvəlki hesabatları gətir
export const getPreviousReports = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json({
      success: true,
      data: {
        excelReports: user.assetExcelReports,
        pdfReports: user.assetPdfReports
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bütün vəsaitləri gətir
export const getAllAssets = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const { category, location, status } = req.query;
    let assets = user.assets;

    // Filterləmə
    if (category) {
      assets = assets.filter(asset => asset.category === category);
    }
    if (location) {
      assets = assets.filter(asset => asset.location === location);
    }
    if (status) {
      assets = assets.filter(asset => asset.status === status);
    }

    // Sıralama (ən yeni üstə)
    assets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: assets,
      count: assets.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vəsaiti ID ilə gətir
export const getAssetById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const asset = user.assets.id(req.params.assetId);
    if (!asset) {
      return res.status(404).json({ message: "Vəsait tapılmadı" });
    }

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni vəsait yarat
export const createAsset = async (req, res) => {
  try {
    const {
      inventoryNumber,
      name,
      category,
      account,
      location,
      initialValue,
      currentValue,
      purchaseDate,
      serviceLife,
      notes
    } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // İnventar nömrəsi unikallığını yoxla
    const existingAsset = user.assets.find(asset => asset.inventoryNumber === inventoryNumber);
    if (existingAsset) {
      return res.status(400).json({ message: "Bu inventar nömrəsi artıq mövcuddur" });
    }

    const assetData = {
      inventoryNumber,
      name,
      category,
      account,
      location,
      initialValue,
      currentValue,
      purchaseDate: new Date(purchaseDate),
      serviceLife,
      notes,
      status: "Aktiv"
    };

    const newAsset = user.addAsset(assetData);
    await user.save();

    res.status(201).json({
      success: true,
      data: newAsset,
      message: "Vəsait uğurla əlavə edildi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vəsaiti yenilə
export const updateAsset = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const asset = user.assets.id(req.params.assetId);
    if (!asset) {
      return res.status(404).json({ message: "Vəsait tapılmadı" });
    }

    Object.assign(asset, {
      ...req.body,
      updatedAt: new Date()
    });

    // Amortizasiyanı yenidən hesabla
    const amortizationData = user.calculateAmortization(asset);
    asset.amortization = amortizationData.amortization;
    asset.amortizationPercentage = amortizationData.amortizationPercentage;

    await user.save();

    res.json({
      success: true,
      data: asset,
      message: "Vəsait uğurla yeniləndi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vəsaiti sil
export const deleteAsset = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    user.assets.pull(req.params.assetId);
    await user.save();

    res.json({
      success: true,
      message: "Vəsait uğurla silindi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 KATEQORİYA ƏMƏLİYYATLARI

// Bütün kateqoriyaları gətir
export const getCategories = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json({
      success: true,
      data: user.assetCategories,
      count: user.assetCategories.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni kateqoriya yarat
export const createCategory = async (req, res) => {
  try {
    const { name, description, amortizationRate } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Kateqoriya adı unikallığını yoxla
    const existingCategory = user.assetCategories.find(cat => cat.name === name);
    if (existingCategory) {
      return res.status(400).json({ message: "Bu kateqoriya adı artıq mövcuddur" });
    }

    const newCategory = {
      name,
      description,
      amortizationRate,
      createdAt: new Date()
    };

    user.assetCategories.push(newCategory);
    await user.save();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Kateqoriya uğurla əlavə edildi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kateqoriyanı yenilə
export const updateCategory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const category = user.assetCategories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }

    Object.assign(category, req.body);
    await user.save();

    res.json({
      success: true,
      data: category,
      message: "Kateqoriya uğurla yeniləndi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kateqoriyanı sil
export const deleteCategory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // Bu kateqoriyaya aid vəsaitləri yoxla
    const assetsInCategory = user.assets.filter(asset => asset.category === user.assetCategories.id(req.params.categoryId).name);
    if (assetsInCategory.length > 0) {
      return res.status(400).json({ 
        message: "Bu kateqoriyaya aid vəsaitlər var. Əvvəlcə onları silin və ya başqa kateqoriyaya köçürün." 
      });
    }

    user.assetCategories.pull(req.params.categoryId);
    await user.save();

    res.json({
      success: true,
      message: "Kateqoriya uğurla silindi"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📈 HESABAT ƏMƏLİYYATLARI

// Excel hesabatı yarat
export const generateExcelReport = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const activeAssets = user.assets.filter(asset => asset.status === "Aktiv");
    
    const reportData = activeAssets.map(asset => ({
      inventoryNumber: asset.inventoryNumber,
      name: asset.name,
      category: asset.category,
      account: asset.account,
      location: asset.location,
      initialValue: asset.initialValue,
      currentValue: asset.currentValue,
      amortization: asset.amortization,
      status: asset.status
    }));

    // Burada Excel fayl yaradılması üçün logic əlavə ediləcək
    // Müvəqqəti olaraq data qaytarırıq
    const excelReport = {
      title: "Ümumi hesabat",
      description: "Vəsait siyahısını Excel kimi yüklə",
      fileName: `assets_report_${Date.now()}.xlsx`,
      filePath: `/reports/excel/assets_report_${Date.now()}.xlsx`,
      fileSize: 0,
      generatedAt: new Date(),
      data: reportData
    };

    user.assetExcelReports.push(excelReport);
    await user.save();

    res.json({
      success: true,
      data: excelReport,
      message: "Excel hesabatı uğurla yaradıldı"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PDF hesabatı yarat
export const generatePdfReport = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const activeAssets = user.assets.filter(asset => asset.status === "Aktiv");
    
    const reportData = activeAssets.map(asset => ({
      inventoryNumber: asset.inventoryNumber,
      name: asset.name,
      category: asset.category,
      initialValue: asset.initialValue,
      currentValue: asset.currentValue,
      amortization: asset.amortization,
      amortizationPercentage: asset.amortizationPercentage
    }));

    // Burada PDF fayl yaradılması üçün logic əlavə ediləcək
    const pdfReport = {
      title: "Amortizasiya hesabatı",
      description: "Amortizasiya detalları",
      fileName: `amortization_report_${Date.now()}.pdf`,
      filePath: `/reports/pdf/amortization_report_${Date.now()}.pdf`,
      fileSize: 0,
      generatedAt: new Date(),
      data: reportData
    };

    user.assetPdfReports.push(pdfReport);
    await user.save();

    res.json({
      success: true,
      data: pdfReport,
      message: "PDF hesabatı uğurla yaradıldı"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kateqoriya hesabatı yarat
export const generateCategoryReport = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const categoryReport = user.generateCategoryReport();
    
    user.assetCategoryReports.push(categoryReport);
    await user.save();

    res.json({
      success: true,
      data: categoryReport,
      message: "Kateqoriya hesabatı uğurla yaradıldı"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Şöbə hesabatı yarat
export const generateDepartmentReport = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const departmentData = Array.from(user.departmentValues.entries()).map(([location, stats]) => {
      const totalCurrentValue = user.assetStatistics.totalCurrentValue;
      const percentage = totalCurrentValue > 0 ? (stats.currentValue / totalCurrentValue) * 100 : 0;
      
      return {
        location,
        assetCount: stats.assetCount,
        initialValue: stats.initialValue,
        currentValue: stats.currentValue,
        percentage: Number(percentage.toFixed(2))
      };
    });

    const departmentReport = {
      title: "Şöbə/filial üzrə",
      description: "Şöbələr üzrə xülasə",
      generatedAt: new Date(),
      data: departmentData,
      summary: {
        totalAssets: user.assetStatistics.totalAssets,
        totalInitialValue: user.assetStatistics.totalInitialValue,
        totalCurrentValue: user.assetStatistics.totalCurrentValue
      }
    };

    user.assetDepartmentReports.push(departmentReport);
    await user.save();

    res.json({
      success: true,
      data: departmentReport,
      message: "Şöbə hesabatı uğurla yaradıldı"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bütün hesabatları gətir
export const getReports = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json({
      success: true,
      data: {
        excelReports: user.assetExcelReports,
        pdfReports: user.assetPdfReports,
        categoryReports: user.assetCategoryReports,
        departmentReports: user.assetDepartmentReports
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 STATİSTİKA ƏMƏLİYYATLARI

// Vəsait statistikalarını gətir
export const getAssetStatistics = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json({
      success: true,
      data: user.assetStatistics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Şöbə dəyərlərini gətir
export const getDepartmentValues = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const departmentArray = Array.from(user.departmentValues.entries()).map(([location, stats]) => ({
      location,
      ...stats
    }));

    res.json({
      success: true,
      data: departmentArray
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};