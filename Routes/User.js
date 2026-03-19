var express = require('express');
var router = express.Router();
const db = require("./connection");

// HOME (Dynamic)
router.get("/", async (req, res) => {
    const result = await db("SELECT * FROM site_settings WHERE id=1");
    const doctors = await db("SELECT * FROM doctor_info");
    res.render("user/Home.ejs", {
        hours: result[0],
        doctors: doctors
 
    });
});

// Other pages (Static)
router.get("/about", async (req, res) => {
    const result1 = await db("SELECT * FROM site_settings WHERE id=1");
    const result = await db("SELECT * FROM about_settings WHERE id=1");
    res.render("user/about.ejs", {
        hours: result1[0],
        about: result
    });
});



router.get("/services", async (req, res) => {
    const result = await db("SELECT * FROM site_settings WHERE id=1");
    const services = await db("SELECT * FROM services WHERE id=1");
    res.render("user/services.ejs", {
        hours: result[0],
        services: services[0]

    })
});

router.get("/team", async (req, res) => {
    const result = await db("SELECT * FROM site_settings WHERE id=1");
    const doctors = await db("SELECT * FROM doctor_info");
    res.render("user/team.ejs", {
        hours: result[0],
        doctors: doctors
    });
});

router.get("/appointment", async (req, res) => {
    const result = await db("SELECT * FROM site_settings WHERE id=1");
    const result1 = await db("SELECT * FROM appointments WHERE id=1");
    res.render("user/appointment.ejs", {
        hours: result[0],
        appointment: result1[0]
    })
});

router.get("/contact", async (req, res) => {
    const result = await db("SELECT * FROM site_settings WHERE id=1");
    res.render("user/contact.ejs", {
        hours: result[0]
    })
});

router.post("/book-appointment", async (req, res) => {
    try {
        await db(
            `INSERT INTO patient_appointments (service,doctor,name,email,appointment_date,appointment_time) 
            VALUES (?,?,?,?,?,?)`,
            [
                req.body.service,
                req.body.doctor,
                req.body.name,
                req.body.email,
                req.body.appointment_date,
                req.body.appointment_time,
            ]
        );
        res.redirect("/appointment");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something Went Wrong")
    }
})

module.exports = router;
