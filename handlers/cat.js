const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const formidable = require("formidable");
const breeds = require("../data/breeds.json");
const cats = require("../data/cats.json");

module.exports = (req, res) => {
	const pathname = url.parse(req.url).pathname;

	if (pathname === "/cats/add-cat" && req.method === "GET") {
		let filePath = path.normalize(
			path.join(__dirname, "../views/addCat.html")
		);
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, {
					"Content-Type": "text/plain",
				});

				res.write("Error was found");
				res.end();
				return;
			}

			let catBreedPlaceholder = breeds.map(
				(breed) => `<option value="${breed}">${breed}</option>`
			);
			let modifiedData = data
				.toString()
				.replace("{{catBreeds}}", catBreedPlaceholder);

			res.writeHead(200, {
				"Content-Type": "text/html",
			});
			res.write(modifiedData);
			res.end();
			return;
		});
	} else if (pathname === "/cats/breed-cat" && req.method === "GET") {
		let filePath = path.normalize(
			path.join(__dirname, "../views/addBreed.html")
		);
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, {
					"Content-Type": "text/plain",
				});

				res.write("Error was found");
				res.end();
				return;
			}

			res.writeHead(200, {
				"Content-Type": "text/html",
			});
			res.write(data);
			res.end();
			return;
		});
	} else if (pathname === "/cats/add-cat" && req.method === "POST") {
		let form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {

			if (err) throw err;

			let oldPath = files.upload.path;
			let newPath = path.normalize(
				path.join(__dirname, "../content/images/" + files.upload.name)
			);

			fs.rename(oldPath, newPath, (err) => {
				if (err) throw err;
				console.log("File was uploaded successfully");
			});

			fs.readFile("./data/cats.json", "utf-8", (err, data) => {
				let allCats = JSON.parse(data);
				allCats.push({
					id: new Date(),
					...fields,
					image: files.upload.name,
				});
				let json = JSON.stringify(allCats);
				fs.writeFile("./data/cats.json", json, () => {
					res.writeHead(202, { "location": "localhost:3000" });
					res.end();
				});
			});
		});
	} else if (pathname === "/cats/breed-cat" && req.method === "POST") {
		let formData = "";
		req.on("data", (data) => {
			formData += data;
		});

		req.on("end", () => {
			let body = qs.parse(formData);

			fs.readFile("./data/breeds.json", (err, data) => {
				if (err) {
					throw err;
				}

				let breeds = JSON.parse(data);
				breeds.push(body.breed);
				let json = JSON.stringify(breeds);

				fs.writeFile("./data/breeds.json", json, "utf-8", () =>
					console.log("The breed was uploaded successfully")
				);
				res.writeHead(202, { location: "localhost:3000" });
				res.end();
			});
		});
	} else if (pathname.includes("/cats-edit") && req.method === "GET") {
        let filePath = path.normalize(
			path.join(__dirname, "../views/editCat.html")
		);
            fs.readFile(filePath, 'utf8', (err, data) => {
            
                if (err) {
                    console.log(err);
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
    
                    res.write("Error was found");
                    res.end();
                    return;
                }
                
				let catId = Number(req.url.split("/")[2]);
                let currentCat;
                for(cat in cats){
                    if(cats[cat].id === catId){
                        currentCat = cats[cat];
                    }
                }

                console.log(currentCat);

                let modifiedCats = cats.map((cat) => `
                <li>
                    <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}">
                    <h3>${cat.name}</h3>
                    <p><span>Breed: </span>${cat.breed}</p>
                    <p><span>Description: </span>${cat.description}</p>
                    <ul class="buttons">
                        <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
                        <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
                    </ul>
                </li>
                `);
                
                
                let modifiedData = data.toString().replace('{{cats}}', modifiedCats);
                modifiedData = data.toString().replace('{{id}}', catId);
                modifiedData = modifiedData.replace('{{name}}', currentCat.name);
                modifiedData = modifiedData.replace('{{description}}', currentCat.description);

                const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
                modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));

                modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
                //modifiedData = modifiedData.toString();
                
                res.writeHead(200,{
                    'Content-Type': 'text/html'
                });
                res.write(modifiedData);
                res.end();
                return;
                    
                
            });
	} else if (pathname.includes("/cats-find-new-home") && req.method === "GET") {
		let filePath = path.normalize(
			path.join(__dirname, "../views/catShelter.html")
		);
            fs.readFile(filePath, 'utf8', (err, data) => {
            
                if (err) {
                    console.log(err);
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
    
                    res.write("Error was found");
                    res.end();
                    return;
                }
                
				let catId = Number(req.url.split("/")[2]);
                let currentCat;
                for(cat in cats){
                    if(cats[cat].id === catId){
                        currentCat = cats[cat];
                    }
                }

                console.log(currentCat);

                let modifiedCats = cats.map((cat) => `
                <li>
                    <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}">
                    <h3>${cat.name}</h3>
                    <p><span>Breed: </span>${cat.breed}</p>
                    <p><span>Description: </span>${cat.description}</p>
                    <ul class="buttons">
                        <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
                        <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
                    </ul>
                </li>
                `);
                
                
                let modifiedData = data.toString().replace('{{cats}}', modifiedCats);
                modifiedData = data.toString().replace('{{id}}', catId);
                modifiedData = modifiedData.replace('{{name}}', currentCat.name);
                modifiedData = modifiedData.replace('{{description}}', currentCat.description);
                modifiedData = modifiedData.replace('{{image}}', path.join('../content/images/' + currentCat.image));

                const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
                modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));

                modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
                //modifiedData = modifiedData.toString();
                
                res.writeHead(200,{
                    'Content-Type': 'text/html'
                });
                res.write(modifiedData);
                res.end();
                return;
                    
                
            });
	} else if (pathname.includes("/cats-edit") && req.method === "POST") {
        // let form = new formidable.IncomingForm();
		// form.parse(req, (err, fields, files) => {

		// 	if (err) throw err;

		// 	let oldPath = files.upload.path;
		// 	let newPath = path.normalize(
		// 		path.join(__dirname, "../content/images/" + files.upload.name)
		// 	);

		// 	fs.rename(oldPath, newPath, (err) => {
		// 		if (err) throw err;
		// 		console.log("File was uploaded successfully");
		// 	});

		// 	fs.readFile("./data/cats.json", "utf-8", (err, data) => {
		// 		let allCats = JSON.parse(data);
		// 		allCats.push({
		// 			id: new Date(),
		// 			...fields,
		// 			image: files.upload.name,
		// 		});
		// 		let json = JSON.stringify(allCats);
		// 		fs.writeFile("./data/cats.json", json, () => {
		// 			res.writeHead(202, { "location": "localhost:3000" });
		// 			res.end();
		// 		});
		// 	});
		// });
        let form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {

			if (err) throw err;

			let oldPath = files.upload.path;
			let newPath = path.normalize(
				path.join(__dirname, "../content/images/" + files.upload.name)
			);

			fs.rename(oldPath, newPath, (err) => {
				if (err) throw err;
				console.log("File was uploaded successfully");
			});

			fs.readFile("./data/cats.json", "utf-8", (err, data) => {
                if(err) {
                    console.log(err);
                } else {
                    let currentCat = JSON.parse(data);
                    let catId = req.url.split('/')[2];
                    currentCat = currentCat.filter((cat) => {
                        if(cat.id === catId) {

                            cat = {
                                id: catId,
                                ...fields,
                                image: files.upload.name
                            };
                        } 
                        
                    });
                    
                    let json = JSON.stringify(currentCat);
                    fs.writeFile("./data/cats.json", json, () => {
                    res.writeHead(202, { 'location': "localhost:3000" });
                    res.end();
                    });
                }
			});
		});
	} else if (pathname.includes("/cats-find-new-home") && req.method === "POST") {
        fs.readFile(
			"./data/cats.json",
			"utf8",
			function readFileCallback(err, data) {
				if (err) {
					console.log(err);
				} else {
					let currentCats = JSON.parse(data);
					let catId = req.url.split("/")[2];

					currentCats = currentCats.filter((cat) => cat.id !== catId);
					let json = JSON.stringify(currentCats);
					fs.writeFile("./data/cats.json", json, "utf8", () => {
						res.writeHead(200, { 'location': "localhost:3000" });
						res.end();
					});
				}
			}
		);
	} else {
		return true;
	}
};
