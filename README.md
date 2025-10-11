<div align="center">

# Previsão de Produtividade de Soja Utilizando Adaptação de Domínio

<div align="left">

## Introdução

Este projeto tem como objetivo desenvolver uma metodologia baseada em aprendizado profundo e adaptação de domínio para a previsão da produtividade da soja em propriedades rurais. A abordagem utiliza dados de sensoriamento remoto e variáveis climáticas para capturar padrões associados ao desenvolvimento da cultura, transferindo o conhecimento aprendido em escala municipal para o nível de propriedade. Dessa forma, busca-se superar a ausência de rótulos diretos em propriedades rurais e fornecer estimativas de produtividade precisas e aplicáveis à agricultura de precisão, contribuindo para o planejamento e a tomada de decisão no setor agrícola.

<div align="center">

  <img src="Diagramas do Projeto/resumo_projeto.png" width="400" alt="Fluxograma geral do prjeto desenvolvido."/>

<div align="left">

## Dataset

O modelo é composto por dois conjuntos de dados: um em nível municipal e outro em nível de propriedade. As *features* foram extraídas por meio do Google Earth Engine (GEE), enquanto as informações de produtividade em escala municipal foram obtidas a partir do Instituto Brasileiro de Geografia e Estatística (IBGE). Além disso, o *MapBiomas* foi utilizado como máscara de uso e cobertura do solo, garantindo que as *features* fossem capturadas apenas em áreas efetivamente cultivadas com soja.

### *Features* Utilizadas

As *features* utilizadas são:

* `Normalized Difference Vegetation Index (NDVI)`  (índice espectral que indica a densidade e a saúde da vegetação na área estudada.)
* `Normalized Difference Water Index (NDWI)`       (índice espectral relacionado ao conteúdo de água na vegetação e no solo na área estudada.)
* `Temperatura máxima`                             (média das temperaturas máximas registradas na área duranto período de estudo.)
* `Temperatura mínima`                             (média das temperaturas mínimas registradas na área duranto período de estudo.)
* `Precipitação`                                   (quantidade média de precipitação registrada na área.)
* `Radiação solar`                                 (quantidade de energia solar incidente sobre a área.)

### Extração a Nível Municipal

### Extração a Nível de Propriedade

## Resultados

<div align="center">

<img src="Resultados/resultado_municipio.png" width="400" alt="Resultado da previsão a nível municipa"/>
<img src="Resultados/resultado_propriedade.png" width="400" alt="Resultado da sobreposição entre os espaços latentes"/>
<img src="Resultados/espacos_latentes.png" width="400" alt="Resultados a Nível de Propriedade"/>

</div>

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
