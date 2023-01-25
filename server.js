const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const todos = [];
let num = 0;

const createTodo = (call, callback) => {
  // console.log(call);
  const todoItem = {
    id: num++,
    text: call.request.text,
  };
  todos.push(todoItem);
  callback(null, todoItem);
};

const readTodos = (call, callback) => {
  callback(null, { items: todos });
};

const readTodosStream = (call, callback) => {
  todos.forEach((t) => call.write(t));
  call.end();
};

const server = new grpc.Server();
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream,
});
server.start();
