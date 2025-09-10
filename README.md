# 🗂️ Asset Tracking Management

Aplikasi ini digunakan untuk mengelola aset perusahaan, memantau kondisi & status, serta mengatur penugasan aset kepada karyawan.  
Dilengkapi dengan fitur master data, assignment, dashboard, dan laporan.

---

## 🚀 Fitur Utama

### 1. Master Data
- **Employees** → Data karyawan (ID, kode, nama, departemen, cabang, alamat, telepon, email, attachment).  
- **Assets** → Data aset (ID, kode, nama, harga, lampiran, kategori, kondisi, departemen, cabang, status tersedia/tidak).  
- **Conditions** → Kondisi aset (baru, rusak, perlu perbaikan, dll).  
- **Departments** → Data departemen.  
- **Categories** → Kategori aset (komputer, kendaraan, mesin, dll).  
- **Branches** → Data cabang (ID, kode, nama, alamat).  

### 2. Assignments
- **CRUD Line Items**:  
  - **Create** → Assign aset baru ke karyawan.  
  - **Update** → Perbarui kondisi aset.  
- Menyimpan relasi antara aset dengan:  
  - Departemen  
  - Cabang  
  - Karyawan  
  - Kondisi  
  - Status  

**Field Assignment**:  
- ID  
- Assign Date  
- Asset ID  
- Employee ID  
- Condition  
- Attachment  

### 3. Reports & Dashboard
- Ringkasan data aset dan distribusi.  
- Laporan kondisi aset, status ketersediaan, serta histori penugasan.  

---

### Tech Stack
- ./fe -> React + tauri
- ./be -> Phyton -> FastAPI

### 💡 Authors 
- A***
- M***
- R**

