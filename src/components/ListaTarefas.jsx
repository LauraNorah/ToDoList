import { useState, useEffect } from 'react'; //Importando hooks do react, o useState cria e gerencia o estado dos componentes e o useEffect executa o código automáticamente (determinados componentes e em determinados momentos) mesmo com interações externas (salvando as alterações).
import './ListaTarefas.css'; // importa o css da ListaTarefas para ser aplicada a estilização.

function ListaTarefas() { //cria o componete funcional chamado de ListaTarefas.
    const [tarefas, setTarefas] = useState([]); //const que cria um array para guardar as tarefas criadas e setTarefas para usar/atualizar essas tarefas.
    const [novaTarefa, setNovaTarefa] = useState(''); // const para criar nova tarefa com base no que o usuária digitou no input e a armazena. o set usa e atusliza essa novatarefa armazenada.
    const [novaDescricao, setNovaDescricao] = useState('');
    const [ordenacao, setOrdenacao] = useState(''); // const para ser aplicada a ordenação da lista de tarefas, pode ser por data de criação ou alfabética de A-Z.
    const [carregado, setCarregado] = useState(false); //const que cria um estado booleano carregando, começando como falso, mostrando que as tarefas ainda não foram salvas no localstorage.

//o localStorage anteriormente não estava funfando, (e nada que eu fazia dava certo :) ) então a forma que em encontrei de fazer ele funcionar foi essa:
useEffect(() => {
    const tarefasSalvas = localStorage.getItem('tarefas'); //pega do localStorage as "tarefas".
    try {
        const tarefasCarregadas = JSON.parse(tarefasSalvas); //transforma a string salva no localStorage em um array com JSON.parse.Se o valor não for um JSON pode dar erro.
        if (Array.isArray(tarefasCarregadas)) { //verifica se o resultado realmente é um array (e não null por exemplo).
            setTarefas(tarefasCarregadas); //se for um array, atualiza o estado tarefas com as tarefas carregadas.
        }
    } catch (erro) { //se ocorrer algum erro no JSON.parse exibirá na tela, evitando que o código quebre caso esteja corrompido.
        console.error("Erro ao carregar tarefas do localStorage:", erro);
    } finally {
        setCarregado(true); //foi finalizada a tentativa para carregar os dados, o salvamento desses dados foi liberado.
    }
}, []); //até onde eu entendi, o localStorage anteriormente estava com um array vazio antes das tarefas salvas serem carregadas, de forma que, ao recarregar a página, o array do localStorage era enviado para a tela sem nada dentro dele, para concertar isso usei a flag.

/* localStorage anterior:
useEffect(() => {
    const tarefasSalvas = localStorage.getItem('tarefas'); //salva a lista de tarefas existente ou atualizada no navegador
    if (tarefasSalvas) {
        setTarefas(JSON.parse(tarefasSalvas)); //transforma o texto em array antes de salvar.
    }
}, []);
*/
    useEffect(() => { // Salvar tarefas no localStorage sempre que mudarem
        if (carregado) { //só vai salvar as tarefas se as mesmas forem carregadas
            localStorage.setItem('tarefas', JSON.stringify(tarefas)); //salva a string tarefas convertida para JSON no localStorage com a chave "tarefas".
        }
    }, [tarefas, carregado]);


    const adicionarTarefa = () => { //adiciona uma nova tarefa desejada
        if (novaTarefa.trim() !== '') { //remove os espaços em branco antes e depois do texto digitado no input.
            const nova = {
                texto: novaTarefa, //recebe o nome da tarefa de acordo com o que o usuário digitou no input.
                descricao: novaDescricao, //pode adicionar descrição para a tarefa criada.
                concluida: false, //para concluir a tarefa, é iniciado como falso.
                data: new Date().toISOString(), //salva a data que a tarefa foi adicionada na lista.
            };
            setTarefas([...tarefas, nova]); //adiciona essa nova tarefa no array.
            setNovaTarefa(""); //depois de adicionada a tarefa, limpa o input.
            setNovaDescricao("");
        }
    };

    const alternarConclusao = (indice) => { //altera o estado de "concluída" da tarefa, pelo indice (ou desmarca de concluída).
        const novasTarefas = tarefas.map((tarefa, i) =>
            i === indice ? { ...tarefa, concluida: !tarefa.concluida } : tarefa //copia todos os dados da tarefas já digitados e apenas troca o campo para concluída.
        );
        setTarefas(novasTarefas);
    };

    const removerTarefa = (indice) => { //remove uma tarefa da lista, pelo indice.
        const novasTarefas = tarefas.filter((_, i) => i !== indice); //filtra todas as tarefas, menos a que o indice foi passado.
        setTarefas(novasTarefas);
    };

    const ordenarTarefas = (tipo) => { //ordena as tarefas da lista por tipo: data de i ou ordem alfabética de A-Z.
        const ordenadas = [...tarefas]; //pegas as tarefas do array original tarafas e deixa ordenada.
        if (tipo === 'alfabetica') {
            ordenadas.sort((a, b) => a.texto.localeCompare(b.texto)); //se escolhida a Ordem Alfabética usa localeCompare para comparar strings.
        } else if (tipo === 'data') {
            ordenadas.sort((a, b) => new Date(a.data) - new Date(b.data)); //se escolhida ordenar por data, compara as tarefas adicionadas por tempo usando Date.
        }
        setOrdenacao(tipo);
        setTarefas(ordenadas);
    };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return ( //retorna as funções acima para ainterface gráfica.
        <div className="lista">

            <h2 /*Título da lista */>TO-DO LIST</h2>

            <input //cria o input para o usuário adicionar a tarefa que deseja.
                type='text'//será o texto/nome da tarefa.
                value={novaTarefa}
                onChange={(e) => setNovaTarefa(e.target.value)} //se mudar, o setNovaTarefa atualiza.
                placeholder='Adicione uma tarefa'
            />

            <button /*cria o botão adicionar que chama a função adicionar tarefa */ onClick={adicionarTarefa}>Adicionar</button>

            <textarea
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                placeholder='Adicione uma descrição para essa tarefa'
            />

            <label /*cria um label para o usuário selecionar como deseja ordenar sua lista */> Ordenar por: </label>
            <select value={ordenacao} onChange={(e) => ordenarTarefas(e.target.value)}>
                <option value="data">Data</option>
                <option value="alfabetica">A-Z</option>
            </select>

            <ul>
                {tarefas.map((tarefa, indice) => ( //percorre as tarefas e exibe uma lista(li) para cada uma.
                    <li key={indice} className={tarefa.concluida ? 'concluida' : ''}>
                        <strong>{tarefa.texto}</strong>
                        <p>{tarefa.descricao}</p>

                        <div /*botões para concluir e remover cada uma das tarefas.*/className='botoes'>
                            <button onClick={() => alternarConclusao(indice)}>
                                {tarefa.concluida ? 'Desmarcar' : 'Concluir'}
                            </button>

                            <button onClick={() =>
                                removerTarefa(indice)}>Remover</button>
                        </div>

                    </li>
                ))}
            </ul>

        </div>
    );
}

export default ListaTarefas; //finalizado o código e pronto para ser exportado para o App.jsx