import { aplicarHeader } from '/assets/js/components/header.js';
import { aplicarFooter } from '/assets/js/components/footer.js';


import { criarDestaqueLivros } from '/assets/js/components/destaque-livros.js';
import { criarDestaqueAutores } from '/assets/js/components/destaque-autores.js';
import { gerarDestaqueArtigo } from '/assets/js/components/destaque-artigos.js';


aplicarHeader();

criarDestaqueLivros();
criarDestaqueAutores();
gerarDestaqueArtigo();

aplicarFooter();