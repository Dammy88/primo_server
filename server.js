var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
var mimeTypes = {
    "html": "text/html",
    "css": "text/css",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "txt": "text/plain"
}

// implementiamo ora la verifica sullo stato del file in modo ASINCRONO
function stato_file(filename, callback){
    fs.lstat(filename,
        function (err, stats){
            if(err){
                callback(err);
                return;
            }
            callback(err, stats)
        });
};

function processa(req, res){
    // parse prende una url come stringa e ritorna un oggetto
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), decodeURI(uri));
    
    /* IMPLEMENTAZIONE SINCRORNA
    
    var statFile;
    try{
        statFile = fs.lstatSync(filename); // genera un'eccezione se il file non esiste
        } catch (e) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Resource Not Found\n');
            res.end();
            return;
        }
        // se la richiesta corrisponde a un file
        if(statFile.isFile()){
            var mimeTypes = mimeTypes[path.extname(filename).split(".").reverse()[0]];
            res.writeHead(200, {'Content-Type': mimeType});
                // crea uno stream dal file e lo va a scrivere all'interno di res
                var fileStream =fs.createReadStream(filename);
                fileStream.pipe(res);
        } else if (statFile.isDirectory()) {
            // se la richiesta corrisponde a un file directory
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('La risorsa ' + uri + ' è una directory' + '\n');
            res.end();
        } else {
            // se la richiesta punta ad altro oggetto: es symbolic link
            res.writeHead(403, {'Content-Type': 'text/plain'});
            res.write('Request Forbidden \n');
            res.end();
        }
    */
   // IMPLEMENTAZIONE ASINCRONA
   stato_file(filename,
    function (err, stats){
        console.log("I'm processing" + filename + '\n');
        if(err){
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Resource Not Found\n');
            res.end();
            return;
        }

        if(uri === '/about.html'){
            res.writeHead(403, {'Content-Type': 'text/plain'});
            res.write('Request Forbidden \n');
            res.end();
        // eventualmente fare controllo anche su RE-DIREZIONI (vedi esempio in if seguente)

            /*
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Welcome to about us page'); 
            res.end();
            */
        } else if(uri === '/'){
            let indx = fs.readFileSync('./index.html').toString();
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indx);
            /*
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Radice!');
            res.end();
            */
            /*} else if(uri === '/index.html'){
            stats.readFile('./index.html', function (err, html) {
            if (err) {
                throw err; 
            }
            
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
            
            });
            */

        // se la richiesta corrisponde a un file
        } else if(stats.isFile()){
            var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
            res.writeHead(200, {'Content-Type': mimeType});
                // crea uno stream dal file e lo va a scrivere all'interno di res
                var fileStream =fs.createReadStream(filename);
                fileStream.pipe(res);
        } else if (stats.isDirectory()) {
            // se la richiesta corrisponde a un file directory
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('La risorsa ' + uri + ' è una directory' + '\n');
            res.end();
        } else {
            // se la richiesta punta ad altro oggetto: es symbolic link
            res.writeHead(403, {'Content-Type': 'text/plain'});
            res.write('Request Forbidden \n');
            res.end();
        }

    });
    
    console.log(req.url);
    console.log(process.cwd());
    //var corpo = 'Sono qui! Mi hai chiamato da ' + req.url + ' con metodo: ' + req.method + '\n';
    //var content_length = corpo.length;

    //res.writeHead(200, {'Content-Length': content_length, 'Content-Type': 'text/plain'});
    //res.end(corpo);
}

console.log("Server is available \n");

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080; // Port 8080 if you run locally
var address = process.env.OPENSHIFT_NODEJS_ip || "127.0.0.1"; // Listening to localhost if you run locally

var s = http.createServer(processa);
s.listen(port, address);