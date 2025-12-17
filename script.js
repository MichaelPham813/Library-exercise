const myLibrary = [];
const showBtn = document.getElementById("showDialog");
const dialog = document.getElementById("dialogContainer");
const closeBtn = dialog.querySelector("#closeDialog");

//Add books to library
function Book(id,name, author,pages,status){
    if(!new.target)
    {
        throw Error("You must use 'new' operator to call the constructor");
    }
    this.id = id;
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

Book.prototype.toggleStatus = function()
{
    this.status = !this.status;
};


//Generate ID based on title and author (same Title can have a multiple Author but not one Author with similar Title)
function generateID(title,author)
{
    const key = `${[title,author]}`;
    let id = localStorage.getItem(key);
    if(!id)
    {
        id = crypto.randomUUID();
        localStorage.setItem(key,id);
    }
    return id;
}

showBtn.addEventListener("click", () => 
{
    dialog.showModal();
});

closeBtn.addEventListener("click", (ev)=>
{
    dialog.close();
    ev.preventDefault();
});

function addBookToLibrary(ev){

    try{
    console.log("function has been activated")
    ev.preventDefault();
    //this will lead to randomize id everytime
    let nameBox = document.getElementById('name-box');
    let authorBox = document.getElementById('author-box');
    let pagesBox = document.getElementById('pages-box');
    let statusBox = document.getElementsByName('Read Status');

    let nameValue = nameBox.value;
    let authorValue = authorBox.value;
    let pagesValue = pagesBox.value;
    let statusValue = "";

    if(nameValue == '' || authorValue == '' || pagesValue == '')
    {
        alert("Please enter book info");
        return 0;
    }

    //Checked the radio box
    for (let i = 0; i < statusBox.length ; i++)
    {
        if(statusBox[i].checked)
        {
            statusValue = (statusBox[i].value === 'Read');
        }
    }

    const idGen = generateID(nameValue,authorValue)

    if(myLibrary.some(book => book.id == idGen ))
    {
        return 0;
    }

    const books = new Book(idGen,nameValue,authorValue,pagesValue,statusValue);
    myLibrary.push(books);
    console.log(myLibrary);
    booksDisplay();

    }catch(error)
    {
        console.error("Error: ",error)
        alert("An error has occurred: "+ error.message);
    }

}

//Display the books for people to see
function booksDisplay()
{
    const displayLibrary = document.getElementById("display");

    
    [...displayLibrary.children].forEach(child => 
    {
        if(!child.classList.contains('dummy'))
            {
                child.remove();
            }
    });


    for(let i = 0 ; i < myLibrary.length; i++)
    {
        const book = myLibrary[i];
        const template = 
        `
            <div class = "libraryContainer">
                <div class="book">
                    <p id = "books-id"><strong>ID:</strong> ${book.id}</p>
                    <p id = "books-title"><strong>Title:</strong> ${book.name}</p>
                    <p id = "books-author"><strong>Author:</strong> ${book.author}</p>
                    <p id = "books-pages"><strong>Pages:</strong> ${book.pages}</p>
                    <p id = "books-status"><strong>Status:</strong> ${book.status ? "Read" : "Not Read"}</p>               
                </div>
                <div class = "btnDiv">
                    <button class = "removeBook" onclick="deleteBook()">
                        Remove
                    </button>
                    <button class = "statusBtn" data-index = "${i}"  onclick = "adjustReadStatus()">
                        Change read status
                    </button>
                </div>            
            </div>            
        `;
        displayLibrary.insertAdjacentHTML('beforeend',template);
    }
    deleteBook()
    adjustReadStatus();
}


function deleteBook()
{
    const displayLibrary = document.getElementsByClassName("removeBook");
    const libraryDummy = document.querySelector("dummy");

    for(var i = 0 ; i < displayLibrary.length ; i++)
    {
        
        displayLibrary[i].addEventListener('click', function(i)
        {
           if(libraryDummy)
           {
                libraryDummy.remove();
           }
           else
           {
                myLibrary.splice(i,1);
           }
           booksDisplay();
        });
    }
    
}

function adjustReadStatus()
{
    const statusButton = document.getElementsByClassName("statusBtn");
    for(var i = 0 ; i < statusButton.length ; i++)
    {
        statusButton[i].addEventListener('click',function(e)
        {
            const index = e.target.dataset.index;
            myLibrary[index].toggleStatus();
            booksDisplay();
        });
    } 
}

function closeForm()
{
    let nameBox = document.getElementById('name-box');
    let authorBox = document.getElementById('author-box');
    let pagesBox = document.getElementById('pages-box');

    nameBox.value = "";
    authorBox.value = "";
    pagesBox.value = "";
}
