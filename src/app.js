const { app } = require("./index");
const PORT = process.env.PORT || 3040;

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
