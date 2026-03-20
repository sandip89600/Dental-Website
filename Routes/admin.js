var express = require('express');
var router = express.Router()
const multer = require('multer');
const db = require("./connection");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

const upload = multer({ storage: storage })



router.get("/test", async (req, res) => {
    try {
        const db = req.app.get("db");

        const [rows] = await db.query("SELECT * FROM your_table");

        res.json(rows);
    } catch (err) {
        console.log(err);
        res.send("DB Error");
    }
});

router.get("/", (req, res) => {
    res.render("admin/dashboard.ejs")
})

router.get("/form", (req, res) => {
    res.render("admin/form");
});

router.get("/update-about-title", (req, res) => {
    res.render("admin/update-about-title");
});

router.get("/update-appointment", (req, res) => {
    res.render("admin/update-appointment")
})

router.get("/delete-appointment/:id", async (req, res) => {

    await db(
        "DELETE FROM patient_appointments WHERE id=?",
        [req.params.id]
    );

    res.redirect("/admin/appointments");
});


router.post("/update-appointment", async (req, res) => {
    try {
        await db(
            "UPDATE appointments SET appointments_title=?, appointments_paragarph=?, appointments_subparagarph=? WHERE id=1",
            [
                req.body.appointments_title,
                req.body.appointments_paragarph,
                req.body.appointments_subparagarph]
        );

        res.redirect("/admin/update-appointment");

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/appointments", async (req, res) => {
    const result1 = await db("SELECT * FROM site_settings WHERE id=1");
    const result = await db("SELECT * FROM patient_appointments ORDER BY id DESC");
    res.render("admin/appointments", {
        hours: result1[0],
        appointments: result

    })
})



router.post("/update-hours", async (req, res) => {
    try {
        await db(
            "UPDATE site_settings SET opening_days=?, opening_time=?, closing_time=?, sunday_status=? WHERE id=1",
            [
                req.body.days,
                req.body.open,
                req.body.close,
                req.body.sunday
            ]
        );
        res.redirect("/admin/form");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/update-about-title", upload.single("about_image"), async (req, res) => {
    const imageName = req.file.filename;
    try {

        await db(
            "UPDATE about_settings SET about_title=?,about_subtitle=?,about_subtitle1=?,about_descriptiom=?,about_image=? WHERE id=1",
            [
                req.body.about_title,
                req.body.about_subtitle,
                req.body.about_subtitle1,
                req.body.about_descriptiom,
                imageName
            ]
        );

        res.redirect("/admin/update-about-title");

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/service1", (req, res) => {
    res.render("admin/services1")
})


router.post("/save_data",
  upload.fields([
    { name: "s_image1", maxCount: 1 },
    { name: "s_image2", maxCount: 1 }
  ]),
  async (req, res) => {

    const image1 = req.files["s_image1"]
      ? "/uploads/" + req.files["s_image1"][0].filename
      : null;

    const image2 = req.files["s_image2"]
      ? "/uploads/" + req.files["s_image2"][0].filename
      : null;

    await db(
      `INSERT INTO services (s_name, s_image1, s_image2) VALUES (?,?,?)`,
      [
        req.body.s_name,
        image1,
        image2
      ]
    );

    res.redirect("/services");
});



router.get("/doctors", (req, res) => {
    res.render("admin/doctor-form.ejs")
})


router.post("/save-doctor", upload.single("d_image"), async (req, res) => {

    const imageName = req.file ? "/uploads/" + req.file.filename : null;

    await db(`INSERT INTO doctor_info 
    (d_name,d_role,d_insta,d_face,d_twt,d_li,d_image) 
    VALUES (?,?,?,?,?,?,?)`, [
        req.body.d_name,
        req.body.d_role,
        req.body.d_insta,
        req.body.d_face,
        req.body.d_twt,
        req.body.d_li,
        imageName
    ]);

    res.redirect("/admin/doctors"); // ya jo bhi page ho
});




module.exports = router;
