// close Navigation Bar
function closeNavBar()
{
    let totalWidth = $("#mainNav").outerWidth(true);
    $("ul li").css({display:"none",top:"90px"});
    $("#mainNav").animate({left:-totalWidth},500);
    $("#secondNav").animate({left:"0%"},500);
    $(".fa-xmark").addClass("d-none");
    $(".fa-bars").removeClass("d-none");
}

// click to close navigation bar
$(".fa-xmark").click(function(){
    closeNavBar();
})


// open Navigation Bar
function openNavBar()
{
    let totalWidth = $("#mainNav").outerWidth(true);

    for(let i=0;i<5;i++)
    {
        $("ul li").eq(i).css({display:"block"});
        $("ul li").eq(i).animate({top: "0px"}, (i + 5) * 100)
        // $("ul li").eq(i).slideDown((i+1)*500);
    }
    
    if($("#mainNav").css("left")=="0px")
    {
        $(".fa-xmark").addClass("d-none");
        $(".fa-bars").removeClass("d-none");
        $("#mainNav").animate({left:-totalWidth},500);
        $("#secondNav").animate({left:0},500);
    }
    else
    {
        $(".fa-xmark").removeClass("d-none");
        $(".fa-bars").addClass("d-none");
        $("#mainNav").animate({left:0},500);
        $("#secondNav").animate({left:totalWidth-5+"px"},500);
    }
}

// click to open navigation bar
$(".fa-bars").click(function(){
    openNavBar();
})


// display all meals
function displayMeals(array)
{
    $("#homeImages").html("");
    for(let i=0;i<array.length;i++)
    {
        $("#homeImages").append(`
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div onclick='displayDetails(${array[i].idMeal})' class="images">
                        <img class="img-fluid rounded-3" src="${array[i].strMealThumb}" alt="Meal ${i+1}">
                        <div class="layer d-flex align-items-center px-2">
                            <h1>${array[i].strMeal}</h1>
                        </div>
                    </div>
                </div>
        `)
    }
    
}

// display all details about meal
async function displayDetails(idMeal)
{
    $("#homeImages").fadeOut(0);
    $("#mealDetails").fadeIn(500);

    $("#search").css({display:"none"});

    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");
    $("#DetailsID").html("");

    let apiMealId  =await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    apiMealId = await apiMealId.json();
    apiMealId = apiMealId.meals[0];

    // add image and name of meal
    $("#DetailsID").append(`
        <div class="col-lg-4">
            <div class="text-white">
                <img class="img-fluid rounded-3" src="${apiMealId.strMealThumb}" alt="Meal 1">
                <h4 class="py-3">${apiMealId.strMeal}</h4>
            </div>
        </div>
    
    `)

    // add all details about meal
    $("#DetailsID").append(`
        <div class="col-lg-8">
            <div class="text-white">
                <h1 class="mb-3">Instructions</h1>
                <p>${apiMealId.strInstructions}</p>
                <h3 class="mb-3">Area : ${apiMealId.strArea}</h3>
                <h3 class="mb-3">Category : ${apiMealId.strCategory}</h3>
                <h3 class="mb-3">Recipes : </h3>
                <ul id="Ingredient" class="d-flex flex-wrap g-5">

                </ul>

                <h3 class="mb-3">Tages : </h3>
                <ul id="tagID" class="d-flex flex-wrap g-5">
                </ul>
                <a href="${apiMealId.strSource}" target="_blank" class="btn btn-success me-3" >Source</a>
                <a href="${apiMealId.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
            </div>
        </div>
    
    `)

    // check if ingredient is null
    for(let i = 1; i<=20; i++)
    {
        if(apiMealId[`strIngredient${i}`]=="")
        {
           break;
        }
        else
        {
            $("#Ingredient").append(`
            <li class="alert alert-info m-2 p-2">${apiMealId[`strMeasure${i}`]} ${apiMealId[`strIngredient${i}`]}</li>
            `)
        }
    }

    // split string of tags
    let tagSplit = apiMealId[`strTags`];
    if(tagSplit!=null)
    {
        tagSplit = tagSplit.split(",");
        for(let i =0;i<tagSplit.length;i++)
        {
            $("#tagID").append(`
                <li class=" list-unstyled alert alert-danger m-2 p-2">${tagSplit[i]}</li>
            `)
        }
    }
    loadScreen();
    
}

// serach By Name
async function searchByName(name)
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");

    let searchByNameApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    searchByNameApi = await searchByNameApi.json();
    searchByNameApi = searchByNameApi.meals;
    if(searchByNameApi)
    {
        $("#homeImages").fadeIn(500);
        displayMeals(searchByNameApi);
        loadScreen();
    }
    else
    {
        $("#homeImages").html("");
        loadScreen();
    }
}

// enter name of meal
$("#nameSearch").keyup(function(){
    $("#letterSearch").val("");
    searchByName($("#nameSearch").val());
    $("#homeImages").html("");
})

// search by letter
async function searchByLetter(letter)
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");

    let searchByLetterApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    searchByLetterApi = await searchByLetterApi.json();
    searchByLetterApi = searchByLetterApi.meals;

    if(searchByLetterApi)
    {
        $("#homeImages").fadeIn(500);
        displayMeals(searchByLetterApi);
        loadScreen();
    }
    else
    {
        loadScreen();
        $("#homeImages").html("");
    }
}

// enter letter of meal
$("#letterSearch").keyup(function(){
    $("#nameSearch").val("");
    searchByName($("#letterSearch").val());
    $("#homeImages").html("");
})

// display all categories
function displayCategories(array)
{
    $("#categoryId").html("");

    for(let i =0;i<array.length;i++)
    {
        $("#categoryId").append(`
       
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div onclick="displayByCategoryName('${array[i].strCategory}')" class="images text-center rounded-4">
                    <img class="img-fluid rounded-3" src="${array[i].strCategoryThumb}" alt="category ${i+1}">
                    <div class="layer">
                        <h1>${array[i].strCategory}</h1>
                        <span>${array[i].strCategoryDescription.split(" ").slice(0,20).join(" ") }</span>
                    </div>
                </div>
            </div>
        `)
    }
}

// display meal by category name
async function displayByCategoryName(name)
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");

    let categoryMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
    categoryMealsApi = await categoryMealsApi.json();
    categoryMealsApi = categoryMealsApi.meals;

    $("#categoryId").html("");
    $("#category").css({display:"none"});

    $("#homeImages").fadeIn(500);
    displayMeals(categoryMealsApi);
    loadScreen();
}


// display all areas
function displayArea(array)
{
    $("#areaId").html("");

    for(let i =0;i<array.length;i++)
    {
        $("#areaId").append(`
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div onclick="displayByAreaName('${array[i].strArea}')">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h1>${array[i].strArea}</h1>
                </div>
             </div>
        `)
    }
}

// display meal by area
async function displayByAreaName(name)
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");

    let areaNameApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`);
    areaNameApi = await areaNameApi.json();
    areaNameApi = areaNameApi.meals;

    $("#areaId").html("");
    $("#area").css({display:"none"});

    $("#homeImages").fadeIn(500);
    displayMeals(areaNameApi);
    loadScreen();
}

// display all Ingredients
function displayIngredients(array)
{
    $("#ingredientsId").html("");

    for(let i=0;i<20;i++)
    {
        $("#ingredientsId").append(`
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div onclick="displayByIngredientsName('${array[i].strIngredient}')" class="text-white text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${array[i].strIngredient}</h3>
                    <p>${array[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        `)
    }
}

// display meal by ingredients
async function displayByIngredientsName(name)
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");

    let ingredientNameApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`);
    ingredientNameApi = await ingredientNameApi.json();
    ingredientNameApi = ingredientNameApi.meals;

    $("#ingredientsId").html("");
    $("#ingredients").css({display:"none"});

    $("#homeImages").fadeIn(500);
    displayMeals(ingredientNameApi);
    loadScreen();
}

// check name validation
function checkName()
{
    let namevalidation = /^[a-zA-Z ]{3,15}$/;  
    return namevalidation.test($("#nameInput").val());
}

// check email validation
function checkEmail()
{
    let emailValidation =  /^[a-zA-Z][a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z]{3,5}$/;
    return emailValidation.test($("#emailInput").val());
}

// check phone validtaion
function checkPhone()
{
    let phoneValidation = /^(01)[0-2 5][0-9]{8}$/;
    return phoneValidation.test($("#phoneInput").val())
}

// check age validation
function checkAge()
{
    let ageValidation = /^(1[89]|[2-9]\d)$/;
    return ageValidation.test($("#ageInput").val());
}   

// check password validation
function checkPassword()
{
    let passwordValidation =  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    return passwordValidation.test($("#passwordInput").val())
}

// check repassword
function checkRePassword()
{
    return $("#reInput").val() == $("#passwordInput").val();
}

// check all inputs valid
function enableButton()
{
    if($("#nameInput").hasClass("is-valid")&&$("#emailInput").hasClass("is-valid")&&$("#phoneInput").hasClass("is-valid")&&$("#ageInput").hasClass("is-valid")&&$("#passwordInput").hasClass("is-valid")&&$("#reInput").hasClass("is-valid"))
    {
        document.getElementById("buttonId").removeAttribute("disabled");
    }
    else
    {
        document.getElementById("buttonId").setAttribute("disabled",true);
    }
}

// contact us
function contactUs()
{
    $("#nameInput").keyup(function(){
        if(checkName())
        {
            $("#nameInput").removeClass("is-invalid");
            $("#nameInput").addClass("is-valid");
            $("#nameInput").next().fadeOut(100);
            enableButton();
        }
        else
        {
            $("#nameInput").addClass("is-invalid");
            $("#nameInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled",true);
        }
    })
    
    $("#emailInput").keyup(function(){
        if(checkEmail())
        {
            $("#emailInput").removeClass("is-invalid");
            $("#emailInput").addClass("is-valid");
            $("#emailInput").next().fadeOut(100);
            enableButton();
        }
        else
        {
            $("#emailInput").addClass("is-invalid");
            $("#emailInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled",true);
        }
    })

    $("#phoneInput").keyup(function(){
        if(checkPhone())
        {
            $("#phoneInput").removeClass("is-invalid");
            $("#phoneInput").addClass("is-valid");
            $("#phoneInput").next().fadeOut(100);
            enableButton();
        }
        else
        {
            $("#phoneInput").addClass("is-invalid");
            $("#phoneInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled",true);
        }
        
    })

    $("#ageInput").keyup(function(){
        if(checkAge())
        {
            $("#ageInput").removeClass("is-invalid");
            $("#ageInput").addClass("is-valid");
            $("#ageInput").next().fadeOut(100);
            enableButton();
        }
        else
        {
            $("#ageInput").addClass("is-invalid");
            $("#ageInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled",true);
        }
       
    })

    $("#passwordInput").keyup(function(){
        if(checkPassword())
        {
            $("#passwordInput").removeClass("is-invalid");
            $("#passwordInput").addClass("is-valid");
            $("#passwordInput").next().fadeOut(100);
            enableButton();
        }
        else
        {
            $("#passwordInput").addClass("is-invalid");
            $("#passwordInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled",true);
        }
        
    })

    $("#reInput").keyup(function(){
        if(checkRePassword() && $("#passwordInput").val()!="")
        {
            $("#reInput").removeClass("is-invalid");
            $("#reInput").addClass("is-valid");
            $("#reInput").next().fadeOut(100);
            enableButton();
        }
        else
        {
            $("#reInput").addClass("is-invalid");
            $("#reInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled",true);
        }
        
    })  
}

// clear inputs
function clearInputs()
{
    $("#nameInput").val("");
    $("#emailInput").val("");
    $("#phoneInput").val("");
    $("#ageInput").val("");
    $("#passwordInput").val("");
    $("#reInput").val("");
    $("#nameInput").removeClass("is-valid");
    $("#emailInput").removeClass("is-valid");
    $("#phoneInput").removeClass("is-valid");
    $("#ageInput").removeClass("is-valid");
    $("#passwordInput").removeClass("is-valid");
    $("#reInput").removeClass("is-valid");
    document.getElementById("buttonId").setAttribute("disabled",true);
}

// click button
$("#buttonId").click(function(){
    clearInputs();
})

// load screen
function loadScreen()
{
    $(document).ready(function(){
        $(".loading").fadeOut(1000);
        $("body").css("overflow","auto");
    })
}

// fetch meal api
async function homeApi()
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");
    let home = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s");
    home = await home.json();
    home = home.meals;
    displayMeals(home);
    loadScreen();
}

// fetch category api
async function categoryApi()
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");
    let categoryApi = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    categoryApi = await categoryApi.json();
    categoryApi = categoryApi.categories;
    displayCategories(categoryApi);
    loadScreen();
}

// fetch area api
async function areaApi()
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");
    let apiArea = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    apiArea = await apiArea.json();
    apiArea = apiArea.meals;
    displayArea(apiArea);
    loadScreen();
}

// fetch Ingredient api
async function ingresdientApi()
{
    $(".loading").css({display:"flex"}); 
    $("body").css("overflow","hidden");
    let apiIngredient = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    apiIngredient = await apiIngredient.json();
    apiIngredient = apiIngredient.meals;

    displayIngredients(apiIngredient);
    loadScreen();
}

closeNavBar();
homeApi();

// get href of link
$("nav a").click(function (eInfo){ 
    href = $(eInfo.target).attr("href");
    $("#homeImages").html("");
    if(href == "#category")
    {
        $("#mealDetails,#search, #ingredients,#contact, #area").css({display:"none"});
    
        categoryApi();
    }
    else if(href == "#area")
    {
        $("#mealDetails,#search,#category, #ingredients,#contact ").css({display:"none"});
        
        areaApi();
    }
    else if(href=="#ingredients")
    {
        $("#mealDetails,#search,#category,#contact, #area ").css({display:"none"});

        ingresdientApi();
    }
    else if(href == "#search")
    {
        $("#nameSearch").val("");
        $("#letterSearch").val("");
        $("#mealDetails,#category, #ingredients,#contact, #area ").css({display:"none"});
    }
    else if(href == "#contact")
    {
        $("#mealDetails,#search,#category, #ingredients, #area ").css({display:"none"});
        contactUs();
    }
    $(href).fadeIn(500);
    
    
    closeNavBar();
});
