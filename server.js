const app = require ('./app');
const port = 3000;

app.app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});