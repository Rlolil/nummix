# Nummix Backend

## Qısa Məlumat

Nummix Backend — müəssisə səviyyəli maliyyə, inventar, satış və ödəniş idarəetməsi üçün hazırlanmış RESTful API serveridir. Server Node.js və Express ilə yazılıb, məlumatlar MongoDB-də saxlanılır (Mongoose ilə).

Bu README yeni başlayanlar üçün addım-addım quraşdırma, işlətmə və ən vacib təhlükəsizlik tövsiyələrini aydın şəkildə izah edir.

## Əsas Xüsusiyyətlər

- İstifadəçi qeydiyyatı və autentifikasiyası (JWT)
- İstifadəçi idarəetməsi (CRUD)
- Satış, sifariş, anbar (warehouse) əməliyyatları
- Ödənişlər və bank/cash əməliyyatları
- Supplier və customer idarəetməsi
- Excel ixracı, PDF generator və e-mail göndərmə
- Swagger ilə avtomatik API sənədləşdirmə

## Texnologiya yığını

- Node.js (təklif edilir: v16+ və ya v18+)
- Express 5
- MongoDB (Atlas və ya localhost)
- Mongoose (ORM)
- jsonwebtoken (JWT)
- bcryptjs
- dotenv
- cors
- express-rate-limit
- nodemailer
- multer
- exceljs
- swagger-jsdoc / swagger-ui-express
- nodemon (inkişaf üçün)

Paketlər `package.json`-da tam siyahı ilə verilmişdir.

## Başlanğıc — Quraşdırma və Konfiqurasiya

1. Reponu klonlayın və qovluğa keçin:

```powershell
git clone https://github.com/AllyintheCode/Nummix-backend.git
cd Nummix-backend
```

2. Asılılıqları qurun:

```powershell
npm install
```

3. `.env` faylını yaradın. Aşağıdakı nümunəni `./.env` faylına əlavə edin (NAZİK: real parolları buraya yapışdırmayın; aşağıdakı nümunə demonstrasiyadır):

```
# Məsələn:
MONGO_URI= mongodb+srv://nummixaz_db_user:tzXxsn6fZhGCnwk7@cluster0.1ignz7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=nummixsecret
EMAIL_USER=nummixaz@gmail.com
EMAIL_PASS=yghwmzquhpgkbykf
```

4. `.env` faylını `.gitignore` daxil edin və onu repoya push etməyin.

## Serverin işə salınması

- İnkişaf rejimi (lokal, fayl dəyişikliklərinə avtomatik restart üçün):

```powershell
npm run dev
```

- Normal rejim (production):

```powershell
npm start
```

Server başladıqdan sonra brauzerdə `http://localhost:5000/` ünvanına gedərək yoxlaya bilərsiniz.

## API sənədləri (Swagger)

Layihədə Swagger UI mövcuddur. Server işləyərkən sənədləri aşağıdakı linkdən açın:

```
http://localhost:5000/api-docs
```

Swagger bütün mövcud endpoint-ləri, tələb olunan parametrləri və nümunə bədənləri göstərir.

## Tez-tez istifadə edilən endpoint nümunələri

- Sağlamlıq yoxlaması:

```powershell
curl http://localhost:5000/
```

- Yeni istifadəçi qeydiyyatı (POST):

```http
POST /api/users/register
Content-Type: application/json

{
	"fullName": "Test User",
	"companyName": "Test Co",
	"email": "test@example.com",
	"password": "strongPassword123"
}
```

Endpoint-lərin tam siyahısını və sahələrini `http://localhost:5000/api-docs`-dan yoxlayın.

## Fayl və qovluq strukturu (qısa)

- `index.js` — serverin başlanğıcı, universal middleware və routelar burada qeyd olunur
- `routes/` — hər bir modul üçün routelər (`userRoutes.js`, `salesRoute.js`, və s.)
- `controllers/` — hər route-un iş məntiqi (CRUD əməliyyatları və biznes qaydalar)
- `models/` — Mongoose sxemaları
- `config/db.js` — MongoDB ilə qoşulma funksiyası
- `middlewares/` — auth, upload, rate limit və s. middleware-lər
- `utils/` — token yaratma, e-mail göndərmə və digər köməkçi funksiyalar
- `swaggerOptions.js` / `swagger.json` — Swagger konfiqurasiyası

## Mühit dəyişənləri və təhlükəsizlik

- `MONGO_URI` — MongoDB bağlantısı. Heç vaxt açıq şəkildə GitHub-a push etməyin.
- `JWT_SECRET` — ən azı 32 simvoldan ibarət, təsadüfi string olmalıdır. Yaratmaq üçün:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- `EMAIL_PASS` üçün Gmail istifadə edirsinizsə, `App Password` istifadə edin və iki faktorlu doğrulamadan istifadə edin.
- `rejectUnauthorized` kimi parametrlərin `true` qalmasına diqqət yetirin; sertifikat yoxlamasını söndürməyin.
- Konsolda həssas məlumat yazmayın (parollar, tam kart məlumatları və s.).

## Tövsiyə olunan təhlükəsizlik və keyfiyyət təkmilləşdirmələri

- Input validation üçün `express-validator` və ya `Joi` əlavə edin.
- Mərkəzi error handling middleware yaradın (generic message + server-side logging).
- Daha yaxşı logging üçün `winston` və ya `pino` istifadə edin.
- Kritik endpoint-lər (login, payment) üçün güclü rate limiting tətbiq edin.
- Testlər əlavə edin: `jest` və ya `mocha` + `supertest` ilə endpoint testləri.

## Test və debugging

- Unit/integration testləri yoxdur — manual test üçün Postman və ya `curl` istifadə edin.
- Lokal debugging üçün `NODE_ENV=development` istifadə edin və `npm run dev` ilə çalışdırın.

## Problemlərin aradan qaldırılması (Troubleshooting)

- Server start olmursa:

  - `.env` faylınızın düzgün konfiqurasiya olunduğunu yoxlayın (xüsusilə `MONGO_URI`).
  - `npm install` ilə asılılıqları yenidən quraşdırın.
  - Əgər `EADDRINUSE` xətası görünürsə, `PORT`-u dəyişin və ya portu istifadə edən prosesi dayandırın.

- MongoDB bağlantı xətaları üçün:
  - Atlas istifadə edirsinizsə: IP whitelist-yə öz lokal IP-nizi əlavə edin və connection string-də istifadəçi/şifrəni yoxlayın.

## Katqı və PR qaydası

- Layihəni fork edin -> yeni branch yaradın -> dəyişiklik edin -> PR göndərin.
- PR izahında nə dəyişdiyinizi və test addımlarını qeyd edin.

## Əlavə fayllar (məsləhət)

- `CONTRIBUTING.md` — kod yazma qaydaları və PR prosesləri
- `SECURITY.md` — məsuliyyət, report yolu və sürətli patch təlimatları
- Postman koleksiyası — tez test üçün

## Lisenziya

Layihənin `package.json` faylında lisenziya `ISC` kimi göstərilib. Lazım olsa dəyişdirin.

---

Əlavə etməyimi istədiyiniz bölmə varsa, deyin: mən `CONTRIBUTING.md`, `SECURITY.md` və ya Postman kolleksiyasını hazırlayım.
