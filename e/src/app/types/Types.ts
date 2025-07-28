// Tipagem para um produto individual
export interface Produto {
  id: number;
  nome: string;
  price: number;
  descricao: string;
  produtoFoto: string;
}

// Tipagem para uma categoria, que contém uma lista de produtos
export interface Categoria {
  id: number;
  nome: string;
  produtos: Produto[];
}

// Lista de categorias
export type ListaCategorias = Categoria[];


export interface Cliente {
    id: number;
    nome: string;
    cpf: string;
    endereco: string;
    fotoUrl: string;
}


export interface Carrinho {
  	
		id: number,
    produto: Produto,
		quantidade: number
	
}

export interface Produto {
  id: number;
  nome: string;
  price: number;
  descricao: string;
  produtoFoto: string;
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number | null;
  produto: Produto;
}

export interface Pedido {
  id: number;
  status: string;
  dataCriacao: string;
  valorTotal: number;
  itens: ItemPedido[];
}
