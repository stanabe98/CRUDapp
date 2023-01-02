

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/get')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

const addBtn = document.querySelector('#add-name-btn');
const updateBtn=document.querySelector('#update-row-btn');
const searchBtn= document.querySelector('#search-btn');

searchBtn.onclick =function(){
    const searchValue= document.getElementById('search-input').value

    fetch('http://localhost:3000/search/' +searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

}



addBtn.onclick = function () {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:3000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name})
    })
    .then(response => response.json())
    // .then(data =>  location.reload()); //this also works but this refreshed the page
    .then(data => insertRowIntoTable(data.data))

}


function insertRowIntoTable(data) {

    ///only adding one element
    console.log(data);
    const table = document.getElementById('tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

document.getElementById('tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        console.log('clicked')
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});


function handleEditRow(id) {
    const updateSection = document.getElementById("update-row");
    updateSection.hidden =false;
    document.querySelector('#update-row-btn').dataset.id= id;


}

updateBtn.onclick =function() {
    const updateNameInput= document.getElementById('update-name-input');
    fetch('http://localhost:3000/update/', {
        method: 'PATCH',
        headers:{
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data=> {
        if(data.success) {
            location.reload();
        } 
    })
}



function deleteRowById(id) {
    fetch('http://localhost:3000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}


function loadHTMLTable(data) {
    console.log(data)
    const table = document.getElementById('tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}


