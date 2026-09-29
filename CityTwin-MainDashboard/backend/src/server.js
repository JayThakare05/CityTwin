import app from './app.js'
import { assertConfiguration, config } from './config.js'

assertConfiguration()
app.listen(config.port, () => console.log(`CityTwin API listening on port ${config.port}`))
