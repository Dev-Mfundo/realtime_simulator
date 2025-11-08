const { app } = require("./index");
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
