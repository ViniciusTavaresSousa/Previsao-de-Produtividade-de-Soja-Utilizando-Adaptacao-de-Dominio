<div align="center">

# Previsão de Produtividade de Soja Utilizando Adaptação de Domínio

----------

[![python](https://img.shields.io/badge/python-3.12.11-green)]()
[![tensorflow](https://img.shields.io/badge/tensorflow-2.19.0-orange)]()

----------


<div align="left">

## Introdução

A previsão de produtividade agrícola desempenha um papel fundamental no cenário atual do agronegócio, auxiliando no planejamento estratégico, na gestão de recursos e na tomada de decisão em diferentes etapas da produção. Com esse propósito, este projeto propõe uma metodologia baseada em aprendizado profundo e adaptação de domínio para estimar a produtividade da soja em propriedades rurais a partir de dados de sensoriamento remoto e variáveis climáticas.

Um dos principais desafios enfrentados nesse contexto é a ausência de rótulos diretos em nível de propriedade, o que limita o uso de modelos supervisionados tradicionais. Para superar essa barreira, a abordagem desenvolvida transfere o conhecimento aprendido em escala municipal para o nível de propriedade, explorando a similaridade entre domínios.

Como resultado, o modelo é capaz de estimar intervalos de produtividade por meio dos quantis Q10, Q50 e Q90, que representam, respectivamente, os cenários pessimista, mediano e otimista. Essa estratégia permite quantificar a incerteza das previsões e fornecer estimativas mais confiáveis, apoiando o planejamento agrícola e a tomada de decisão no campo.

<p align="center"><strong>Visão geral do projeto</p>
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

### Extração das *Features*

<p align="center"><strong>Extração a nível municipal</p>
<div align="center">
  <img src="Extração das Features/extracao_municipio.png" width="600" alt="Extração a nível municipal"/>
</div>

<p align="center"><strong>Extração a nível de propriedade</p>
<div align="center">
    <img src="Extração das Features/extracao_propriedade.png" width="600" alt="Extração a nível de propriedade"/>
</div>

<p align="left">
Podemos observar o <em>shapefile</em> contornado em preto e a classificação do <em>MapBiomas</em> destacada em amarelo. As <em>features</em> são extraídas a partir da interseção entre o polígono do <em>shapefile</em> e a área correspondente identificada pelo <em>MapBiomas</em>.
</p>

🔗 [Download dos `Assets` necessários para a extração das *features* no Google Drive](https://drive.google.com/drive/folders/1WTsv4biJ8nTMDHalD5_1xbZCB3uhsJ4K?usp=sharing)

## Resultados
<p align="center"><strong>Resultado da previsão a nível municipal</p>
<div align="center">
  <img src="Resultados/resultado_municipio.png" width="600" alt="Resultado da previsão a nível municipal"/>
</div>

<p align="left">
Os resultados obtidos em nível municipal indicaram um MAE de 401,66 kg/ha entre o quantil mediano (𝑄50) previsto e a produtividade real observada. Esse valor sugere que o modelo apresentou boa capacidade de generalização e convergência durante o treinamento.
</p>

<p align="center"><strong>Resultado da sobreposição entre os espaços latentes</p>
<div align="center">
    <img src="Resultados/espacos_latentes.png" width="600" alt="Resultado da sobreposição entre os espaços latentes"/>
</div>

<p align="left">
Os resultados indicam que a adaptação de domínio foi eficaz, pois o modelo conseguiu gerar vetores latentes invariantes entre os domínios municipal e de propriedade. Essa carac- terística permite que o modelo realize previsões em nível de propriedade com desempenho semelhante ao obtido em nível municipal.
</p>

<p align="center"><strong>Resultado da previsão a nível de propriedade</p>
<div align="center">
    <img src="Resultados/resultado_propriedade.png" width="600" alt="Resultados a nível de propriedade"/>
</div>

<p align="left">
Das quatro amostras disponíveis, observa-se que o modelo realizou previsões consistentes da produtividade, apresentando um MAE de 206,1 kg/ha entre o quantil mediano (𝑄50) e a produtividade real. Este desempenho é ainda superior ao observado nas previsões em nível municipal, evidenciando a eficácia do modelo.


## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
