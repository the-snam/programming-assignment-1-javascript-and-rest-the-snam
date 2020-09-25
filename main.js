/*
 * This files holds all the code for Project 1.
 */

//Run once broswer has loaded everything
window.onload = function () {

 //Function that adds new Divs to the HTML page
 function addHTML(text)
{
  //Grab the container div
  var start_div = document.getElementById('start');
  //make a new Div element
  var newElement = document.createElement('div');
  //add text to that div
  newElement.innerHTML = text;
  //append it to the main 
  start_div.appendChild(newElement);
}


// makes second search based on author ID from arr array; also passes title and author information down the chain from the first part of the program
async function SearchAuthorsHelper (input) {
  let output = new Object()
  output.title = input.title
  output.authorName = input.authorName
  let url2 = new URL('https://openlibrary.org/search.json?')
  url2.searchParams.set('author', input.authorKey);
  const response = await fetch(url2)
  output.data = await response.json()
  return output
  
}


function SearchAuthors (title_search) {
  // generate the base URL
  let url = new URL('https://openlibrary.org/search.json?')
  url.searchParams.set('title', title_search)
  const outputArr = [] // scope reference to final arr outside of fetch statement

  // make initial search
  fetch(url).then(function(response) {return response.json()}).then(function(data){
    // scrape all authors from json document
    const arr = []
    const checkDupsArr = [] // used to ensure no repeat entries, because it's less work to input into two arrays than to figure out how to search the attributes of an array of objects.
    let counter = 0 // use separate counter to avoid having arr be artifically long and have entries interspersed with empty spaces
    for (i in data.docs) {
      //check if the entry has an author and if that author is a duplicate
      if (data.docs[i].hasOwnProperty('author_key')) {
        if (checkDupsArr.indexOf(data.docs[i].author_key[0]) === -1) { 
          checkDupsArr.push(data.docs[i].author_key[0])
          arr[counter] = new Object() // create location to store data about each book-author pair
          arr[counter].authorKey = data.docs[i].author_key[0]
          arr[counter].authorName = data.docs[i].author_name[0]
          arr[counter].title = data.docs[i].title
          counter += 1
        }
      }
    }

    // search based on all those authors
    for (i in arr) {
      SearchAuthorsHelper(arr[i]).then(function(output) {
        output.numOtherBooks = -1
    
        // count an entry as a book if it has a title
        for (j in output.data.docs) {
          if (output.data.docs[j].hasOwnProperty("title")) {
            output.numOtherBooks += 1
          }
        }
        outputArr.push(output)

        // the big finish
        // this if statement should only evaluate to true if the last entry is finished

        // uncomment these to see how close it is to being ready to print the array
        // console.log("arr.length = ", arr.length)
        // console.log("OutputArr.length = ", outputArr.length)
        if (outputArr.length >= arr.length) {
          // sort outputArr
          outputArr.sort(function(a, b) {
            return b.numOtherBooks - a.numOtherBooks
          })

          // add all to HTML display
          for (j in outputArr) {
            let str = "" + outputArr[j].authorName + " wrote " + outputArr[j].title
            if (outputArr[j].numOtherBooks > 0) {
              str += " and " + outputArr[j].numOtherBooks + " other book"
            }
            if (outputArr[j].numOtherBooks > 1) {
              str += "s"
            }
            str += "."
            addHTML(str)
          }
        }
      })
    }  
  })    
}

//gran the current form in the HTML document
var form = document.querySelector("form");

//event that listens for form submit
form.addEventListener("submit", function(event) {
  var search_text = form.elements.value.value;
  
  console.log("Saving value", search_text);
  
  //get main DIV
  var start_div = document.getElementById('start');
 
  //Clear main DIV
  start_div.innerHTML = '';

  
  addHTML("Looking up Authors for search term "+search_text);

  
  //uncomment these lines to run your code here
  SearchAuthors(search_text);
  
  event.preventDefault();
});

};