const jwt = require('jsonwebtoken');

const JWT_SECRET="9f3A&XnP!qL7eTzKmR2Bj5vQpC8xG0sYWdMhJ1oLf6H9Nc4ZkXrPbVt7wJmE2QF3"

const users = [
  {
    _id: "67cd5c7cd1757dabb72ade8b",
    role: "admin",
    name: "AdminUser"
  },
  {
    _id: "67cd5c7ad1757dabb72ade5f",
    role: "user",
    name: "Kyle_Huel"
  },
  {
    _id: "67cd5c7ad1757dabb72ade60",
    role: "user",
    name: "Carlo_Fritsch43"
  },
  {
    _id: "67cd5c7ad1757dabb72ade61",
    role: "user",
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