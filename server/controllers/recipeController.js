require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");





/**
 * get /
 * homepage
 */
exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)
        const thai = await Recipe.find({ 'category': 'Thai'}).limit(limitNumber)
        const american = await Recipe.find({ 'category': 'American'}).limit(limitNumber)
        const chinese = await Recipe.find({ 'category': 'Chinese'}).limit(limitNumber)
        const mexican = await Recipe.find({ 'category': 'Mexican'}).limit(limitNumber)
        
        const food = {latest, thai, american, chinese, mexican}

        res.render("index", { title: "Cooking Blog - Home", categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
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
        res.status(500).send({ message: error.message || "Error occured" });
    }
};


/**
 * get /categories/:id
 * category by id
 */
exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({'category' : categoryId}).limit(limitNumber);

        res.render("categories", { title: "Cooking Blog - Categories", categoryById });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};



/**
 * get /recipe:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId)
        res.render('recipe', {title: 'Cooking Blog - Recipe', recipe})
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};



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
    res.satus(500).send({ message: error.message || "Error Occured" });
  }

}


/**
 * get /explore-latest
 * explore-lateste
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1}).limit(limitNumber)  ;
    res.render('explore-latest', { title: 'Cooking Blog - Latest', recipe })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};









































// async function insertDummyCategoryDate() {
//     try {
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             }
//         ])
//     } catch (error) {
//         console.log('err ', + error)
//     }
// }
// insertDummyCategoryDate()




// async function insertDummyRecipyDate() {
//     try {
//         await Recipe.insertMany([
//             {
//                 "name": "Chicken pesto orzo salad",
//                 "description": `Elevate standard pasta salad by using orzo and pesto. The dish also offers a good way to make the most of asparagus while it’s in season in the spring, too`,
//                 "email": "https://www.bbcgoodfoodme.com/recipes/chicken-pesto-orzo-salad/",
//                 "ingredients": [
//                     "2 boneless, skinless chicken breasts",
//                     "1 lemon, zested and juiced",
//                     "3 garlic cloves, 2 crushed, 1 left whole",
//                 ],
//                 "category": "Mexican",
//                 "image": "Chicken-pesto-orzo-salad.jpg"
//             },
//             {
//                 "name": "Taramasalata",
//                 "description": `Whip up homemade taramasalata instead of using shop-bought. It’s easier than you might think and is a great addition to a grazing platter`,
//                 "email": "https://www.bbcgoodfoodme.com/recipes/taramasalata/",
//                 "ingredients": [
//                     "100g crustless stale white bread (about 5-6 slices)",
//                     "250g smoked cod's roe",
//                     "1 lemon, juiced",
//                 ],
//                 "category": "Mexican",
//                 "image": "Taramasalata.jpg"
//             },
//             {
//                 "name": "Healthy tuna pasta",
//                 "description": `Try our quick and easy healthy tuna pasta. It’s comforting, but also packed with three of your five-a-day and can be doubled to feed a family`,
//                 "email": "https://www.bbcgoodfoodme.com/recipes/healthy-tuna-pasta/",
//                 "ingredients": [
//                     "150g wholemeal penne",
//                     "1 large leek (200g), halved, and thinly sliced",
//                     "1 tsp olive oil",
//                 ],
//                 "category": "Indian",
//                 "image": "Healthy-tuna-pasta.jpg"
//             },
//             {
//                 "name": "Panuozzo sandwich",
//                 "description": `Make your own baguettes and pesto to make these pizza-inspired sandwiches for the whole family. They’re surprisingly quick and easy to make and are great for lunch or a light dinner`,
//                 "email": "https://www.bbcgoodfoodme.com/recipes/panuozzo-sandwich/",
//                 "ingredients": [
//                     "300g strong white bread flour, plus extra for dusting",
//                     "3g (about half a sachet) fast-action dried yeast",
//                     "1 tbsp olive oil",
//                 ],
//                 "category": "American",
//                 "image": "Panuozzo-sandwich.jpg"
//             },
//             {
//                 "name": "Blueberry smoothie recipe",
//                 "description": `Make a quick and simple blueberry smoothie with yogurt, banana and apple juice for busy mornings. You can easily make it vegan by using coconut yogurt`,
//                 "email": "https://www.bbcgoodfoodme.com/recipes/blueberry-smoothie-recipe/",
//                 "ingredients": [
//                     "175g blueberries",
//                     "1 small banana, sliced",
//                     "1 tbsp natural or Greek yogurt",
//                 ],
//                 "category": "Thai",
//                 "image": "Blueberry-smoothie.jpg"
//             },
                
//         ])
//     } catch (error) {
//         console.log('err ', + error)
//     }
// }
// insertDummyRecipyDate()
