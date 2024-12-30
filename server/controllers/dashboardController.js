const Note = require("../models/Notes");
const mongoose = require("mongoose");

// DASHBOARD
exports.dashboard = async (req, res) => {

    let perPage = 8;
    let page = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: "Free NodeJS Notes App"
    };

    try {
        const notes = await Note.aggregate([
            { $sort: { updatedAt: -1 } }, // Newest first
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }, // Fixed ObjectId instantiation
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] },
                },
            },
        ])
            .skip(perPage * (page - 1))
            .limit(perPage);

        const count = await Note.countDocuments();

        res.render("dashboard/index", {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while processing the request.");
    }
};

// VIEW NOTE
exports.dashboardViewNote = async (req, res) => {
    const noteId = req.params.id;
    const note = await Note.findById({ _id: noteId }).where({ user: req.user.id }).lean();
    if(note) {
        res.render("dashboard/view-note", {
            noteID: req.params.id,
            note,
            layout: "../views/layouts/dashboard",
        });
    } else {
        res.send("Note not found");
    }
};

// UPDATE NOTE
exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            {_id: req.params.id,},
            {title: req.body.title, body: req.body.body, updatedAt: Date.now()}
        ).where({user: req.user.id});
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
    }
};

// DELETE NOTE
exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Note.deleteOne({_id: req.params.id}).where({user: req.user.id});
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
    }
};

// ADD NOTE
exports.dashboardAddNote = async (req, res) => {
    res.render("dashboard/add", {
        layout: "../views/layouts/dashboard",
    });
};

// ADD NOTE SUBMIT
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
    }
};

// SEARCH NOTE
exports.dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResult: "",
            layout: "../views/layouts/dashboard",
        });
    } catch (err) {
        console.log(err);
    }
};

// SEARCH NOTE SUBMIT
exports.dashboardSearchSubmit = async (req, res) => {
    try{
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const searchResults = await Note.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, "i")}},
                {body: {$regex: new RegExp(searchNoSpecialChar, "i")}}
            ]
        }).where({user: req.user.id}).lean();

        res.render("dashboard/search", {
            layout: "../views/layouts/dashboard",
            searchResult: searchResults,
        });

    } catch(err){
        console.log(err);
    }
    
};

