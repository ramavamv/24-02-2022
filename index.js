const fsPromise = require('fs').promises;
const path = require('path');

//função anônima
(async () => {
  const folderPath = path.join(__dirname);
  const allFiles = await fsPromise.readdir(folderPath);///leio diretorio que estou
  /*
    allFiles = [
      '.cache',
      '.replit',
      '.upm',
      'file1.txt',
      'file2.txt',
      'file3.txt',
      'index.js',
      'replit.nix'
    ]
  */
  
  //filtrar lista para só arquivos que terminam com .txt
  const txtFiles = allFiles.filter(file => file.endsWith('.txt'));
  // [ 'file1.txt', 'file2.txt', 'file3.txt' ]

  // para cada arquivo dentro de txtFiles
  // retorna a Promise criada com o readFile
  //map passo por cada elemnto da lista, consigo passar a função por eles e retornar um resultado
  //pega o txtFiles, monta o path dele
  //apenas retorno uma lsita de Promise
  const readPromises = txtFiles.map(txtFile => {
    const filePath = path.join(__dirname, txtFile);
    return fsPromise.readFile(filePath, 'utf-8');
  });

  //mesma coisa de o debaixo
  /*
  const result = [];
  for (let i =0; i < txtFiles.length; i++){
    const txtFile = txtFiles[i];
    const filePath = path.join(__dirname, txtFile);
    const readFilePromise = fsPromise.readFile(filePath, 'utf-8');
    result.push(readFilePromise);
  }
*/
  // espera finalizar todas as leituras de arquivo
  // aqui temos mais ou menos isso, um array de Promises
  // [ Promise(readFile('file1.txt')), 
  //Promise(readFile('file2.txt')),
  //Promise(readFile('file3.txt')) ]


  //promise all, assim que todas as leituras terminarem ele vai retornar o 'all content'
  //se uma der erro retorna somente a que ter erro
  const contents = await Promise.all(readPromises);
  console.log(
    'all content:\n',
    contents.join('\n'),
    '\n--------------\n'
  );

  // Promise.race retorna a primeira promise a resolver ou rejeitar
  const firstToResolve = await Promise.race(readPromises);
  console.log(`first to resolve was: ${firstToResolve}`);

  fsPromise.writeFile('hino.txt', contents, (err) => {
    if (err) throw err;
    console.log('O arquivo foi criado!');
  });
})();


