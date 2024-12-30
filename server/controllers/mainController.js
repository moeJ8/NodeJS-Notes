//HOMEPAGE
exports.homepage = async (req, res) => {
    const locals = {
        title: "NodeJS Notes",
        description: "Free NodeJS Notes App"
    }
    res.render("index", {
        locals,
        layout: "../views/layouts/front-page"
    });
}

//ABOUT
exports.about = async (req, res) => {
    const locals = {
        title: "About - NodeJS Notes",
        description: "Free NodeJS Notes App"
    }
    res.render("about", locals);
}

//FAQS
exports.faqs = async (req, res) => {
    const locals = {
        title: "FAQs - NodeJS Notes",
        description: "FAQs for NodeJS Notes App"
    }
    res.render("faqs", locals);
}

//FEATURES
exports.features = async (req, res) => {
    const locals = {
        title: "Features - NodeJS Notes",
        description: "Features for NodeJS Notes App"
    }
    res.render("features", locals);
}

