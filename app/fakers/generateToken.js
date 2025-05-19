const jwt = require('jsonwebtoken');

const JWT_SECRET="9f3A&XnP!qL7eTzKmR2Bj5vQpC8xG0sYWdMhJ1oLf6H9Nc4ZkXrPbVt7wJmE2QF3"

const users = [
  {
    _id: "67cd5c7cd1757dabb72ade8b",
    role: "Admin",
    name: "AdminUser"
  },
  {
    _id: "6824e4c7f37ec6db5b338392",
    role: "Project Manager",
    name: "Project Manager"
  },
  {
    _id: "67cdb38d6af33763cde245bb",
    role: "Developer",
    name: "Raphael_Romaguera51"
  },
  {
    _id: "67cdb38d6af33763cde245b9",
    role: "Developer",
    name: "Zoila_Turner17"
  },
  {
    _id: "67cdb38d6af33763cde245b8",
    role: "Developer",
    name: "Chauncey_Rosenbaum40"
  },
  {
    _id: "67cd5c7ad1757dabb72ade5f",
    role: "User",
    name: "Kyle_Huel"
  },
  {
    _id: "67cd5c7ad1757dabb72ade60",
    role: "User",
    name: "Carlo_Fritsch43"
  },
  {
    _id: "67cd5c7ad1757dabb72ade61",
    role: "User",
    name: "Niko32"
  }
];

users.forEach(user => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  
  console.log(`${user.name} token:`);
  console.log(token);
  console.log(`Editor URL: http://localhost:4000/?token=${token}\n`);
});