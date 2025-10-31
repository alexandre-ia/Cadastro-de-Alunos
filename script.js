let tabmem = [];
let indiceEdicao = null;

// --- CLASSE ALUNO 
class Aluno {
    constructor(nome, idade, matricula, curso, notaFinal) {
        this.nome = nome.trim();
        this.idade = parseInt(idade);
        this.matricula = matricula.trim();
        this.curso = curso.trim();
        this.notaFinal = parseFloat(notaFinal);
    }

    // Método isAprovado() 
    isAprovado() {
        return this.notaFinal >= 7; // Retorna true se notaFinal >= 7 [cite: 29]
    }

    // Método toString() 
    toString() {
        const status = this.isAprovado() ? 'Aprovado' : 'Reprovado';
        return `${this.nome} (${this.curso}) - Matrícula: ${this.matricula}, Nota: ${this.notaFinal.toFixed(1)} (${status})`;
    }
}

// --- FUNÇÕES DE INTERFACE (CRUD) ---

function adicionarDados() {
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const matricula = document.getElementById("matricula").value;
    const curso = document.getElementById("curso").value;
    const notaFinal = document.getElementById("notaFinal").value;

    // Validação básica
    if (!nome || !idade || !matricula || !curso || isNaN(parseFloat(notaFinal))) {
        alert("🚨 Por favor, preencha todos os campos do formulário!");
        return;
    }

    if (indiceEdicao === null) {
        // Modo Cadastro
        const aluno = new Aluno(nome, idade, matricula, curso, notaFinal);
        tabmem.push(aluno);
        alert(`✅ Aluno ${nome} cadastrado com sucesso!`);
    } else {
        // Modo Edição
        const aluno = tabmem[indiceEdicao];
        aluno.nome = nome.trim();
        aluno.idade = parseInt(idade);
        aluno.matricula = matricula.trim();
        aluno.curso = curso.trim();
        aluno.notaFinal = parseFloat(notaFinal);
        
        indiceEdicao = null; // Finaliza o modo edição
        alert(`✏️ Dados do aluno ${aluno.nome} atualizados!`); // Exibir mensagem ao editar [cite: 41]
    }

    atualizarTabela();
    limparCampos();
}

function atualizarTabela() {
    const tbody = document.querySelector("#minhaTabela tbody");
    tbody.innerHTML = "";

    // Arrow Function usada no forEach 
    tabmem.forEach((aluno, index) => {
        const row = tbody.insertRow();
        
        if (aluno.isAprovado()) {
            row.classList.add('aluno-aprovado');
        } else {
            row.classList.add('aluno-reprovado');
        }

        row.insertCell().textContent = aluno.nome;
        row.insertCell().textContent = aluno.idade;
        row.insertCell().textContent = aluno.matricula;
        row.insertCell().textContent = aluno.curso;
        row.insertCell().textContent = aluno.notaFinal.toFixed(1); 

        const cellAcoes = row.insertCell();

        // Botões de Ação na Tabela
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️ Editar";
        btnEditar.classList.add('btn-acao', 'btn-editar'); 
        // Função Anônima/Arrow Function no evento de clique [cite: 39]
        btnEditar.addEventListener('click', () => editarAluno(index)); 
        cellAcoes.appendChild(btnEditar);

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "🗑️ Excluir";
        btnExcluir.classList.add('btn-acao', 'btn-excluir'); 
        // Função Anônima/Arrow Function no evento de clique [cite: 39, 40, 45]
        btnExcluir.addEventListener('click', () => {
             if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome}?`)) {
                tabmem.splice(index, 1);
                atualizarTabela();
                limparCampos(); 
                alert('🗑️ Aluno excluído.'); 
            }
        });
        cellAcoes.appendChild(btnExcluir);
    });
}

function editarAluno(index) {
    const aluno = tabmem[index];

    document.getElementById("nome").value = aluno.nome;
    document.getElementById("idade").value = aluno.idade;
    document.getElementById("matricula").value = aluno.matricula;
    document.getElementById("curso").value = aluno.curso;
    document.getElementById("notaFinal").value = aluno.notaFinal;

    indiceEdicao = index;
    document.getElementById('btn-cadastro').textContent = '💾 Salvar Edição';
}

function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("matricula").value = "";
    document.getElementById("curso").value = "";
    document.getElementById("notaFinal").value = "";
    
    document.getElementById('btn-cadastro').textContent = '📝 Registrar Aluno';
    indiceEdicao = null;
}


// --- FUNÇÕES DE RELATÓRIO 

function listarAlunosAprovados() {
    // Uso de filter 
    const alunosAprovados = tabmem.filter(aluno => aluno.isAprovado()); 
    let listaHTML = '';

    if (alunosAprovados.length > 0) {
        listaHTML += '<ul class="modal-list">';
        // Uso de forEach 
        alunosAprovados.forEach(aluno => { 
            listaHTML += `<li>✅ ${aluno.toString()}</li>`;
        });
        listaHTML += '</ul>';
    } else {
        listaHTML = '<p class="modal-info">Nenhum aluno aprovado (nota $\\geq$ 7.0) encontrado.</p>';
    }

    abrirPopup('Alunos Aprovados (Nota $\\geq$ 7.0)', listaHTML);
}

function calcularMediaNotas() {
    if (tabmem.length === 0) {
        abrirPopup('Média Total das Notas', '<p class="modal-info">Nenhum aluno cadastrado para calcular a média.</p>');
        return;
    }

    // Uso de map e reduce 
    const notas = tabmem.map(aluno => aluno.notaFinal);
    const somaNotas = notas.reduce((total, nota) => total + nota, 0);
    const media = somaNotas / notas.length;

    const resultadoHTML = `
        <p class="modal-result">Média Geral: <strong>${media.toFixed(2)}</strong></p>
        <p class="modal-info">(${tabmem.length} alunos considerados)</p>
    `;

    abrirPopup('📊 Média Total das Notas', resultadoHTML);
}

function calcularMediaIdades() {
    if (tabmem.length === 0) {
        abrirPopup('Média das Idades', '<p class="modal-info">Nenhum aluno cadastrado para calcular a média.</p>');
        return;
    }

    // Uso de map e reduce 
    const idades = tabmem.map(aluno => aluno.idade);
    const somaIdades = idades.reduce((total, idade) => total + idade, 0);
    const media = somaIdades / idades.length;

     const resultadoHTML = `
        <p class="modal-result">Média de Idade: <strong>${media.toFixed(1)} anos</strong></p>
        <p class="modal-info">(${tabmem.length} alunos considerados)</p>
    `;

    abrirPopup('🎂 Média das Idades', resultadoHTML);
}

function listarAlunos() {
    // Uso de slice() e sort() 
    const alunosOrdenados = tabmem.slice().sort((a, b) => a.nome.localeCompare(b.nome));

    let listaHTML = ''; 

    if (alunosOrdenados.length > 0) {
        listaHTML += '<ul class="modal-list alpha-list">';
        alunosOrdenados.forEach(aluno => {
            listaHTML += `<li>${aluno.nome} - ${aluno.curso}</li>`;
        });
        listaHTML += '</ul>';
    } else {
        listaHTML = '<p class="modal-info">Nenhum aluno encontrado.</p>';
    }

    abrirPopup('📄 Lista de Alunos (Ordem Alfabética)', listaHTML);
}

function listarAlunosporCurso() {
    // Mostra a quantidade de alunos por curso 
    const contagemPorCurso = {};
    tabmem.forEach(aluno => {
        const curso = aluno.curso.toUpperCase(); 
        contagemPorCurso[curso] = (contagemPorCurso[curso] || 0) + 1;
    });

    let listaHTML = '';
    const cursosOrdenados = Object.keys(contagemPorCurso).sort();

    if (cursosOrdenados.length > 0) {
        listaHTML += '<ul class="modal-list course-count">';
        cursosOrdenados.forEach(curso => {
            listaHTML += `<li>📚 ${curso}: <strong>${contagemPorCurso[curso]} alunos</strong></li>`;
        });
        listaHTML += '</ul>';
    } else {
        listaHTML = '<p class="modal-info">Nenhum aluno encontrado para contagem por curso.</p>';
    }

    abrirPopup('📚 Contagem de Alunos por Curso', listaHTML);
}


// --- FUNÇÕES DE POP-UP E EVENTOS ---

function fecharPopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    if (popupOverlay) {
        popupOverlay.remove();
    }
}

function abrirPopup(titulo, conteudoHTML) {
    fecharPopup(); 

    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'popupOverlay';
    popupOverlay.classList.add('popup-overlay');
    
    const modalHTML = `
        <div class="popup-content">
            <span class="popup-close" onclick="fecharPopup()">&times;</span>
            
            <h3>${titulo}</h3>
            ${conteudoHTML}
            
            <button class="modal-btn-close" onclick="fecharPopup()">Fechar</button>
        </div>`;

    popupOverlay.innerHTML = modalHTML;
    document.body.appendChild(popupOverlay);
}


document.addEventListener('DOMContentLoaded', () => {
    // Botão de Cadastro
    document.getElementById('btn-cadastro').addEventListener('click', adicionarDados);

    // Botões de Relatórios
    document.getElementById('btn-aprovados').addEventListener('click', listarAlunosAprovados);
    document.getElementById('btn-media-notas').addEventListener('click', calcularMediaNotas);
    document.getElementById('btn-media-idades').addEventListener('click', calcularMediaIdades);
    document.getElementById('btn-listar-alunos').addEventListener('click', listarAlunos);
    document.getElementById('btn-alunos-curso').addEventListener('click', listarAlunosporCurso);

    // Carregar dados iniciais e atualizar a tabela 
    atualizarTabela();
});