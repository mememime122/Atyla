
# Atyla Web3

**Versión 1.0.0**

[Atyla Web3](https://rk0bbjwxgtyy.usemoralis.com/) es un proyecto para integrar funcionalidades Web3 
a la página web de la [Fundación Atyla](https://atyla.org): un token
propio, añadir la opción de donar con la criptomoneda BUSD,
un sistema para rifar viajes en el barco Atyla y un marketplace
de NFTs propios. El objetivo es mejorar la financiación y promoción
de la fundación.
## Documentación

**Solidity**

La carpeta Solidity contiene los smart contracts con los que se
han implementado el token BEP20 ATYLA, los token BEP1155 ATYLA,
el contrato de donaciones y el contrato de rifas de viajes.

- {AtylaToken}: token BEP20 que sirve para pagar funciones de los otros contratos de Atyla Web·. Los otros contratos tienen permitido acuñar ATYLA.
- {AtylaNFTs}: tokens BEP1155 que pueden ser acuñados si se paga su precio en BUSD o ATYLA. La función safeTransferFrom ha sido modificada para que transferir NFTs requiera una comisión en BUSD. El emisor obtiene la cantidad de la comisión en ATYLA como pequeña compensación. El dueño del contrato establece el límite de acuñado de cada token.
- {Donate}: establece quién es el beneficiario de los fondos recaudados. Permite comprar ATYLA con BUSD o donar BUSD.
- {TripRaffles}: permite crear rifas para cada viaje. Los boletos se pueden comprar con BUSD o ATYLA. Si el dinero recaudado por la rifa no es suficiente, no hay ganador y se devuelve el dinero en forma de ATYLA. Si se recauda más de lo necesario, hay ganador y se devuelve el dinero sobrante a los perdedores en forma de ATYLA.


**Web**

Contiene las páginas HTML y sus correspondientes programas de JavaScript.

- index.html y main.js: contienen el "Sing in" y el "Sing out" con Metamask.
- raffle.html y raffle.js: contienen la interfaz para interactuar con {TripRaffles}.
- raffleBoard.html: contiene los viajes que se están rifando actualmente.
- NFTmanager.html y NFTmanager.js: contienen los NFTs de Atyla que existen actualmente.
- mint.html y mint.js: contienen la interfaz para acuñar NFTs.
- transfer.html y transfer.js: contienen la interfaz para transferir NFTs.
- donate.html y donate.js: contienen la interfaz para donar BUSD y comprar ATYLA con BUSD.

**NFT metadata**

Contiene las imágenes de los NFTs y su metadata en formato .json
## Autor

Kerman Alonso Ajuria [@mememime122](https://github.com/mememime122)


## Bibliografía

**Tutorial que constituye la base del proyecto**

- [Ultimate NFT Programming Tutorial - FULL COURSE](https://www.youtube.com/watch?v=tBMk1iZa85Y&list=PL81hom-7r_zSUxsIx6SPGezhivwLGPRKc&index=4)

**Tutoriales consultados en YouTube**
- [Atyla Web3](https://www.youtube.com/playlist?list=PL81hom-7r_zSUxsIx6SPGezhivwLGPRKc)

**Páginas web consultadas/utilizadas**

- [OpenZeppelin GitHub](https://github.com/OpenZeppelin)

- [web3.js](https://web3js.readthedocs.io/en/v1.5.2/index.html)

- [moralis.io](https://moralis.io/)

- [Bootstrap](https://getbootstrap.com/)

- [readme.so](https://readme.so)

- [Math in Solidity (Part 3: Percents and Proportions)](https://medium.com/coinmonks/math-in-solidity-part-3-percents-and-proportions-4db014e080b1)

- [Generate a Random Number in Solidity – Easy Guide](https://codeforgeek.com/generate-random-number-in-solidity/)

- [Atyla Foundation](https://atyla.org/)



## Licencia y copyright

El autor de este trabajo renuncia a todo reclamo de derechos de
autor (económico y moral) de este trabajo y lo coloca inmediatamente
en el dominio público; puede ser utilizado, distorsionado o
destruido de cualquier manera y sin atribución o aviso alguno
al creador.