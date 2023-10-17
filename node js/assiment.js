const readline = require('readline');
const fs = require('fs');

// Create a readline interface for reading input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let todoList = []; // Array to store the todo list tasks

// Function to load the todo list from a file
function loadTodoList() {
  try {
    const data = fs.readFileSync('test.json', 'utf8'); // Read the file synchronously
    todoList = JSON.parse(data); // Parse the JSON data and assign it to the todoList array
  } catch (error) {
    todoList = []; // If there's an error reading the file, set the todoList array to empty
  }
}

// Function to save the todo list to a file
function saveTodoList() {
  const data = JSON.stringify(todoList); // Convert the todoList array to JSON data
  fs.writeFileSync('test.json', data, 'utf8'); // Write the data to the file synchronously
}

// Function to add a task to the todo list
 // Initialize a variable to keep track of the current ID
let currentId = 1;

// Function to add a task to the todo list
function addTask(task, id = null) {
  if (id === null) {
    // If no custom ID is provided, use sequential ID
    const newTask = { id: currentId, task, completed: false }; // Create a new task object with the current ID
    currentId++; // Increment the currentId variable for the next task
    todoList.push(newTask); // Add the new task to the todoList array
  } else {
    // If custom ID is provided, use it
    const newTask = { id, task, completed: false }; // Create a new task object with the custom ID
    todoList.push(newTask); // Add the new task to the todoList array
    currentId = Math.max(currentId, id + 1); // Update the currentId to ensure it's larger than the custom ID
  }

  saveTodoList(); // Save the updated todo list to the file
  console.log('Task added successfully!');
}

// Function to update a task in the todo list
function updateTask(id, updatedTask) {
  const task = todoList.find((item) => item.id === id); // Find the task with the given ID
  if (task) {
    task.task = updatedTask; // Update the task's task property with the new value
    saveTodoList(); // Save the updated todo list to the file
    console.log('Task updated successfully!');
  } else {
    console.log('Task not found!');
  }
}

// Function to delete a task from the todo list
function deleteTask(id) {
  const index = todoList.findIndex((item) => item.id === id); // Find the index of the task with the given ID
  if (index !== -1) {
    todoList.splice(index, 1); // Remove the task from the todoList array
    saveTodoList(); // Save the updated todo list to the file
    console.log('Task deleted successfully!');
  } else {
    console.log('Task not found!');
  }
}

// Function to list all tasks in the todo list
function listTasks() {
  if (todoList.length === 0) {
    console.log('No tasks found!');
  } else {
    console.log('Todo List:');
    todoList.forEach((item) => {
      const status = item.completed ? '[x]' : ''; // Determine the status of the task (completed or not)
      console.log(`${status} ${item.task}`); // Display the task with its status
    });
  }
}

// Function to prompt the user for a command and perform the corresponding action
function promptUser() {
  rl.question('Enter a command (add/update/delete/list/exit): ', (command) => {
    switch (command) {
      case 'add':
        rl.question('Enter a task: ', (task) => {
          addTask(task);
          promptUser();
        });
        break;
      case 'update':
        rl.question('Enter the task ID: ', (id) => {
          rl.question('Enter the updated task: ', (updatedTask) => {
            updateTask(parseInt(id), updatedTask);
            promptUser();
          });
        });
        break;
      case 'delete':
        rl.question('Enter the task ID: ', (id) => {
          deleteTask(parseInt(id));
          promptUser();
        });
        break;
      case 'list':
        listTasks();
        promptUser();
        break;
      case 'exit':
        rl.close(); // Close the readline interface and exit the program
        break;
      default:
        console.log('Invalid command! Please try again.');
        promptUser();
    }
  });
}

module.exports = {
  loadTodoList,
  promptUser
};