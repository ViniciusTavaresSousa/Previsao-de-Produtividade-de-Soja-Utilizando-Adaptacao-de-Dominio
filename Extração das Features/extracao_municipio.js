var anosSafras = [2019, 2020, 2021, 2022, 2023];
var municipio = municipios_RS.merge(municipios_PR).merge(municipios_GO).merge(municipios_MT);

municipio = municipio.map(function(f) {
  return f.simplify(100); 
});

var colecaoMapBiomas = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');
var era5 = ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR");  // Clima

function adicionarAreaSoja(municipios, sojaImg, ano) {
  return municipios.map(function(f) {
    var sojaProp = sojaImg.clip(f.geometry());
    var areaPixels = sojaProp.multiply(ee.Image.pixelArea());
    var areaHa = areaPixels.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: f.geometry(),
      scale: 30,
      maxPixels: 1e9
    }).get('classification_' + ano);

    return f.set('AreaSoja_ha', ee.Number(areaHa).divide(10000));
  });
}

function extrairDadosSafra(ano) {
  var sojaMask = colecaoMapBiomas.select('classification_' + ano).eq(39);

  var dataInicioSafra = ee.Date.fromYMD(ano, 10, 1);
  var dataFimSafra = ee.Date.fromYMD(ano + 1, 3, 1); // final de fevereiro

  var meses = ee.List.sequence(10, 12).map(function(m) { // outubro a dezembro do ano atual
    return ee.Date.fromYMD(ano, m, 1);
  }).cat(ee.List.sequence(1, 2).map(function(m) { // janeiro e fevereiro do próximo ano
    return ee.Date.fromYMD(ano + 1, m, 1);
  }));

  var municipioComArea = adicionarAreaSoja(municipio, sojaMask, ano)
    .filter(ee.Filter.gte('AreaSoja_ha', 1000))
    .filter(ee.Filter.lte('AreaSoja_ha', 20000));

  var dadosPorMes = meses.map(function(dataInicio) {
    dataInicio = ee.Date(dataInicio);
    var dataFim = dataInicio.advance(1, 'month');

    var colecaoS2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterDate(dataInicio, dataFim)
      .filterBounds(municipioComArea)
      .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20))
      .map(function(image) {
        var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
        var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
       
        return image.addBands([ndvi, ndwi]);
      });

    var ultimoVeg = colecaoS2.select(['NDVI','NDWI']).mean();
    var imagemVeg = ultimoVeg.updateMask(sojaMask).clip(municipioComArea);

    var estatisticasVeg = imagemVeg.reduceRegions({
      collection: municipioComArea,
      reducer: ee.Reducer.mean(),
      scale:15,
      maxPixelsPerRegion: 1e9
    });

    var climaMes = era5.filterDate(dataInicio, dataFim);

    var tempK = climaMes.select('temperature_2m').map(function(img) {
      return img.updateMask(sojaMask);
    });
    var tempMax = tempK.reduce(ee.Reducer.max()).subtract(273.15).rename('TempMax');
    var tempMin = tempK.reduce(ee.Reducer.min()).subtract(273.15).rename('TempMin');

    var prec = climaMes.select('total_precipitation_sum')
      .map(function(img) { return img.updateMask(sojaMask); })
      .sum()
      .multiply(1000)
      .rename('Precipitacao');

    var rad = climaMes.select('surface_net_solar_radiation_sum')
      .map(function(img) { return img.updateMask(sojaMask); })
      .sum()
      .divide(1e6)
      .rename('RadiacaoSolar');

    var climaImg = tempMax.addBands([tempMin, prec, rad]);
    var estatisticasClima = climaImg.reduceRegions({
      collection: municipioComArea,
      reducer: ee.Reducer.mean(),
      scale:9000,
      maxPixelsPerRegion: 1e9
    });

    var estatisticasComTudo = estatisticasVeg.map(function(f) {
      var fClima = estatisticasClima.filter(
        ee.Filter.eq('system:index', f.get('system:index'))
      ).first();
      return f.set({
        'TempMax': fClima.get('TempMax'),
        'TempMin': fClima.get('TempMin'),
        'Precipitacao': fClima.get('Precipitacao'),
        'RadiacaoSolar': fClima.get('RadiacaoSolar'),
        'AnoSafra': ano,
        'Mes': dataInicio.format('YYYY-MM')
      });
    });

    return estatisticasComTudo;
  });

  return ee.FeatureCollection(dadosPorMes).flatten();
}

var colecaoFinal = ee.FeatureCollection(anosSafras.map(extrairDadosSafra)).flatten();

Export.table.toDrive({
  collection: colecaoFinal,
  folder: 'GEE',
  description: 'Features_Mun',
  fileFormat: 'CSV'
});

var sojaVis = colecaoMapBiomas.select('classification_' + anosSafras[4]).eq(39);
var municipioComArea = adicionarAreaSoja(municipio, sojaVis, anosSafras[4])
  .filter(ee.Filter.gte('AreaSoja_ha', 1000))
  .filter(ee.Filter.lte('AreaSoja_ha', 20000));

Map.addLayer(sojaVis.updateMask(sojaVis).clip(municipioComArea), {palette: ['yellow']}, 'Soja ' + anosSafras[0]);

var municipioContorno = municipioComArea.style({
  color: 'black',     
  fillColor: '00000000', 
  width: 2            
});

Map.addLayer(municipioContorno, {}, 'Municípios');
