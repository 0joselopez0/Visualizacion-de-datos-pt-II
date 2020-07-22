
window.onload = function () { init() };

var leafConf = {};

function init() {
    leafConf.mapa = L.map('mapa').setView([40.53606, -3.64197], 14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG1rMTciLCJhIjoiY2tjcmFwZmF3MDhteDJzb2VvaXZzbnFweiJ9.PB_trL7bIO-4Mp4vJK99mg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(leafConf.mapa);


    //Funciones de carga

    //Leaflet
    addBussiness();
    addRestaurants();
    addPopulation();
    addPuntoOptimo()


    //D3
    paintCharts();

    //Capturo los checks y por defecto los pongo a true
    leafConf.filtroempresa = document.getElementById('filtroempresas');
    leafConf.filtrorestaurant = document.getElementById('filtrorestaurant');
    leafConf.filtropoblacion = document.getElementById('filtropoblacion');

    leafConf.filtroempresa.checked = true;
    leafConf.filtrorestaurant.checked = true;
    leafConf.filtropoblacion.checked = true;

    //Listeners 

    //Empresa (mapa y dashboards)
    leafConf.filtroempresa.addEventListener("click", function () { evt_Bussines() });

    //Restaruantes (mapa y dashboards)
    leafConf.filtrorestaurant.addEventListener("click", function () { evt_restaurants() });

    //Población (mapa y dashboards)
    leafConf.filtropoblacion.addEventListener("click", function () { evt_population() });

    //Cuando complete quito el icono de carga 
    leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));
}

//================================
//Empresas, pintor y listener
//================================

//Pintor
function addBussiness(mapa) {
    var allPaintedBussiness = L.layerGroup();
    for (i in bussines) {
        if (bussines[i].lat != '' && bussines[i].lon != '') {
            var bussinesSingle = L.circleMarker([bussines[i].lat, bussines[i].lon], {
                color: '#ffb05c',
                radius: 3
            }).addTo(allPaintedBussiness);
        }
    }
    leafConf.allPaintedBussiness = allPaintedBussiness;
    leafConf.allPaintedBussiness.addTo(leafConf.mapa);
}

//Listener
function evt_Bussines() {
    $('#loading').css('display', 'block')
    if (leafConf.filtroempresa.checked == false) {

        leafConf.allPaintedBussiness.eachLayer(function (layer) { leafConf.mapa.removeLayer(layer); });
        leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));
        $('#row_empresas').hide('medium');

    } else {
        addBussiness();
        $('#row_empresas').show('medium');
    }
    leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));

}


//================================
//Restaurantes, pintor y listener
//================================

//Pintor
function addRestaurants() {
    var allPaintedRestaurants = L.layerGroup();
    for (i in restaurants) {
        if (restaurants[i].lat != '' && restaurants[i].lon != '') {
            var restaurantsSingle = L.circleMarker([restaurants[i].lat, restaurants[i].lon], {
                color: '#445dfc',
                radius: 3
            }).addTo(allPaintedRestaurants);
        }
    }

    leafConf.allPaintedRestaurants = allPaintedRestaurants;
    leafConf.allPaintedRestaurants.addTo(leafConf.mapa);
}

//Listener
function evt_restaurants() {
    $('#loading').css('display', 'block')
    if (leafConf.filtrorestaurant.checked == false) {

        leafConf.allPaintedRestaurants.eachLayer(function (layer) { leafConf.mapa.removeLayer(layer); });
        leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));


    } else {
        addRestaurants();
    }
    leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));

}

//================================
//Población, pintor y listener
//================================

//Pintor

function addPopulation() {
    var allPaintedpopulation = L.layerGroup();
    for (i in population) {
        if (restaurants[i].lat != '' && restaurants[i].lon != '') {

            var poblacionbarrio = L.circle([population[i].lat, population[i].lon], {
                color: 'red',
                fillColor: 'rgba(255, 0, 0,0.3)',
                fillOpacity: 0.5,
                radius: population[i].poblacion / 100
            }).bindPopup("<strong>Distrito:</strong> " + population[i].distrito + "<br> <strong>Población:</strong> " + population[i].poblacion + "<br> <strong> Edad Media </strong>" + population[i].edadmedia).addTo(allPaintedpopulation);
        }
    }

    leafConf.allPaintedpopulation = allPaintedpopulation;
    leafConf.allPaintedpopulation.addTo(leafConf.mapa);
}

//Listener 

function evt_population() {
    $('#loading').css('display', 'block')
    if (leafConf.filtropoblacion.checked == false) {

        leafConf.allPaintedpopulation.eachLayer(function (layer) { leafConf.mapa.removeLayer(layer); });
        leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));
        $('#row_poblacion').hide('medium');

    } else {
        addPopulation();
        $('#row_poblacion').show('medium');
    }
    leafConf.mapa.on('dataloadcomplete', $('#loading').css('display', 'none'));
}


//================================
//Punto óptimo
//================================

//Pintor
function addPuntoOptimo() {
    var perfectDot = L.circleMarker([40.5322264, -3.6500698], {
        color: 'green',
        radius: 10
    }).addTo(leafConf.mapa);
}



//================================
//Los Charts 
//================================

//Lanzadera central -> Lanzo cada uno de loos charts que estoy pintando, todo agrupado así por pruebas y demás es mas fácil de controlar.
function paintCharts() {
    paintPopulation();
    paintMainAgePerDistrict();
    paintemp();
    paintrestaurantloc();
}


//Pintar poblacion / distrito

function paintPopulation() {

    var margin = { top: 40, right: 30, bottom: 30, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format(".0%");

    var svg = d3.select("#chartpopulation")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.4);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 10000000]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y).tickSize([]).tickPadding(10);

    var dataset = population;

    x.domain(dataset.map(d => { return d.distrito; }));
    y.domain([0, 80000]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.poblacion === null ? "none" : null; })
        .style("fill", d => {
            return d.poblacion === d3.max(dataset, d => { return d.poblacion; })
                ? highlightColor : barColor
        })
        .attr("x", d => { return x(d.distrito); })
        .attr("width", x.bandwidth())
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 150;
        })
        .attr("y", d => { return y(d.poblacion); })
        .attr("height", d => { return height - y(d.poblacion); });


    svg.selectAll(".label")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => { return d.poblacion === null ? "none" : null; })
        .attr("x", (d => { return x(d.distrito) + (x.bandwidth() / 2) - 8; }))
        .style("fill", d => {
            return d.poblacion === d3.max(dataset, d => { return d.poblacion; })
                ? highlightColor : greyColor
        })
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay((d, i) => { return i * 150; })
        .text(d => { return d.poblacion; })
        .attr("y", d => { return y(d.poblacion) + .1; })
        .attr("dy", "-.7em");


}

//Pintar edad / distrito

function paintMainAgePerDistrict() {

    var margin = { top: 40, right: 30, bottom: 30, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format(".0%");

    var svg = d3.select("#chartedadmedia")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.4);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 10000000]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y).tickSize([]).tickPadding(10);

    var dataset = population;

    x.domain(dataset.map(d => { return d.distrito; }));

    y.domain([0, 50]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.edadmedia === null ? "none" : null; })
        .style("fill", d => {
            return d.edadmedia === d3.max(dataset, d => { return d.edadmedia; })
                ? highlightColor : barColor
        })
        .attr("x", d => { return x(d.distrito); })
        .attr("width", x.bandwidth())
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 150;
        })
        .attr("y", d => { return y(d.edadmedia); })
        .attr("height", d => { return height - y(d.edadmedia); });


    svg.selectAll(".label")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => { return d.edadmedia === null ? "none" : null; })
        .attr("x", (d => { return x(d.edadmedia) + (x.bandwidth() / 2) - 8; }))
        .style("fill", d => {
            return d.edadmedia === d3.max(dataset, d => { return d.edadmedia; })
                ? highlightColor : greyColor
        })
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay((d, i) => { return i * 150; })
        .text(d => { return d.edadmedia; })
        .attr("y", d => { return y(d.edadmedia) + .1; })
        .attr("dy", "-.7em");

}

//Empresa/ location

function paintemp() {

    const height = 400;
    const width = 920;
    const velocityDecay = 0.15;
    const forceStrength = 0.03;

    let nodes;
    let bubbles;

    let rawData = groupJsonByValue(bussines, 'zona');
    generateHeadLeyendemp('leyendaEmp', rawData);
    let forceSimulation;

    let radiusScale;
    let colorScale;
    let heightScale;


    radiusScale = d3.scaleLinear()
        .domain([0, 800])
        .range([5, 800]);

    colorScale = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);

    heightScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, height]);

    nodes = rawData.map(d => {
        return {
            radius: radiusScale(d.count / 5),
            fill: colorScale(d.zona),
            x: Math.random() * width,
            y: heightScale(d.count / 5),
            color: d.color
        }
    })


    d3.select('#charempresas')


    bubbles = d3.select('#charempresas')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', d => { return d.radius })
        .attr('fill', d => { return d.color })
        .attr('stroke', d => { return d.color })
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded)
        )


    forceSimulation = d3.forceSimulation()
        .nodes(nodes)
        .velocityDecay(velocityDecay)
        .on('tick', ticked)
        .force('x', d3.forceX().strength(forceStrength).x(width / 2))
        .force('y', d3.forceY().strength(forceStrength).y(height / 2))
        .force("charge", d3.forceManyBody().strength(charge))


    function dragStarted(d) {
        forceSimulation.alphaTarget(0.3).restart()
    }
    function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
    }

    function dragEnded(d) {
        delete d.fx;
        delete d.fy;
        forceSimulation.alphaTarget(0);
    }

    function ticked() {
        bubbles
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }

    function charge(d) {
        return -Math.pow(d.radius, 2) * forceStrength;
    }

}



//Restaurante -> Location

function paintrestaurantloc() {
    const height = 400;
    const width = 920;
    const velocityDecay = 0.15;
    const forceStrength = 0.03;

    let nodes;
    let bubbles;

    let rawData = groupJsonByValue(restaurants, 'zona');
    generateHeadLeyendemp('leyendares', rawData);
    let forceSimulation;

    let radiusScale;
    let colorScale;
    let heightScale;


    radiusScale = d3.scaleLinear()
        .domain([0, 800])
        .range([5, 800]);

    colorScale = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);

    heightScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, height]);

    nodes = rawData.map(d => {
        return {
            radius: radiusScale(d.count / 5),
            fill: colorScale(d.zona),
            x: Math.random() * width,
            y: heightScale(d.count / 5),
            color: d.color
        }
    })

    d3.select('#charrestaruantes')

    bubbles = d3.select('#charrestaruantes')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', d => { return d.radius })
        .attr('fill', d => { return d.color })
        .attr('stroke', d => { return d.color })
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded)
        )


    forceSimulation = d3.forceSimulation()
        .nodes(nodes)
        .velocityDecay(velocityDecay)
        .on('tick', ticked)
        .force('x', d3.forceX().strength(forceStrength).x(width / 2))
        .force('y', d3.forceY().strength(forceStrength).y(height / 2))
        .force("charge", d3.forceManyBody().strength(charge))


    function dragStarted(d) {
        forceSimulation.alphaTarget(0.3).restart()
    }
    function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
    }

    function dragEnded(d) {
        delete d.fx;
        delete d.fy;
        forceSimulation.alphaTarget(0);
    }

    function ticked() {
        bubbles
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }

    function charge(d) {
        return -Math.pow(d.radius, 2) * forceStrength;
    }
}



//=================================================
// UTILS
//=================================================

//=================================================
//Agrupar JSON por variable
//Para poder pintar una gráfica de pompas con por ejemplo, lugar de la empresa y la cantidad 
//En los parámetros se especifica la variable y devuelve una agrupacion por variable y numero total de cada grupo 
//=================================================

function groupJsonByValue(json, filter) {

    //Recupero los valores únicos y los guardo enss un array 
    var uniqueValues = [];
    for (i in json) {
        var entity = json[i]; //Atajo
        if (uniqueValues.find(element => element.zona == entity[filter]) == undefined) {
            var objectSingle = {}
            objectSingle.zona = entity[filter];
            objectSingle.count = 1;
            objectSingle.color = getRandomColor();
            uniqueValues.push(objectSingle);
        } else {
            for (j in uniqueValues) {
                if (entity[filter] == uniqueValues[j].zona) {
                    uniqueValues[j].count++;
                }
            }
        }
    }

    return uniqueValues;


}

//Generar color random

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


//Generador de cabecera leyenda (emp)

function generateHeadLeyendemp(div, data) {
    for (i in data) {
        $('#' + div).append('<div style="width: 20px; height: 20px; background-color:' + data[i].color + '; border-radius: 50%; margin:5px"></div> <label style="margin:5px">' + data[i].zona + '</label>')
    }
}