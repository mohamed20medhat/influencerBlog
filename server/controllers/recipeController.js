require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const User = require("../models/user")


/**
 * get /
 * homepage
 */
exports.homepage = async (req, res) => {
  let userLogedIN = false 
  let userId 
  if (typeof req.cookies != 'undefined' && typeof req.cookies['jwt'] != 'undefined') {
    userLogedIN = true
  }
  if (typeof req.cookies != 'undefined' && typeof req.cookies['userId'] != 'undefined') {
    userId = req.cookies['userId']
  }


  // console.log('user is loged in' ,userLogedIN)
  // console.log('cookies' , req.cookies)



  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber)
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber)
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber)
    const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(limitNumber)
    const food = { latest, thai, american, chinese, mexican }

    let userAccountPrimumOrNot;
    if(typeof userId !== 'undefined'){
      const user = await User.findById(req.cookies['userId'])   
      userAccountPrimumOrNot = user.isPrimum
      // console.log('user account is primum', userAccountPrimumOrNot)
    }
    

    res.render("index", { title: "Cooking Blog - Home", categories, food, userLogedIN, userAccountPrimumOrNot });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};


/**
 * get /categories
 * categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", { title: "Cooking Blog - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};


/**
 * get /categories/:id
 * category by id
 */
exports.exploreCategoriesById = async (req, res) => {
  if (typeof req.cookies['jwt'] === 'undefined') {
    return res.redirect('/')
  };

  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);

    res.render("categories", { title: "Cooking Blog - Categories", categoryById });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};



/**
 * get /recipe:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  if (typeof req.cookies['jwt'] === 'undefined') {
    return res.redirect('/')
  };

  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId)
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }

}

/**
 * post /search
 * search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error occurred" });
  }

}


/**
 * get /explore-latest
 * explore-latests
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Latest', recipe })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};


/**
 * get /explore-random
 * explore random as json
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count)
    let recipe = await Recipe.findOne().skip(random).exec()
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe })

  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};



/**
 * get /submit-recipe
 * submit recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit')


  res.render('submit-recipe', {
    title: 'cooking Blog - submit recipe', infoErrorsObj, infoSubmitObj
  })
}

/**
 * post /submit-recipe
 * submit recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {

    //uploading an image to the server
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded")
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err)
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredient,
      category: req.body.category,
      image: newImageName,
    })

    await newRecipe.save()

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe')

  } catch (error) {
    // res.json(error)
    req.flash('infoErrors', error)
    res.redirect('/submit-recipe')
  }

}

// // update a record
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'ingredients'}, {name: 'bobbi'})
//     res.n //Number of documented matched
//     res.nModified //Number of documents modified
//   }catch(error) {
//     console.log(error)
//   }
// }
// // updateRecipe()


// // delete a recipe
// async function deleteRecipe() {
//   try {
//     const res = await Recipe.deleteOne({ name: 'New chocolate Cake' })
//   } catch (error) {
//     console.log(error)
//   }
// }
// // deleteRecipe()







































