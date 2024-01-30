const path = require( 'path' );

// игнорируем импорты `.scss`
require( 'ignore-styles' );

// транспилируем на лету импорты
require( '@babel/register')( {
    extensions: ['.js', '.jsx', '.mjs', 'cjs'],
    configFile: path.resolve( __dirname, 'babel.config.js' ),
} );

require( './server.js' );
