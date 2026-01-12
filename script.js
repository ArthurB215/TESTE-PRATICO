const usersContainer = document.getElementById('users');
const tableHead = document.getElementById('tableHead');
const loadButton = document.getElementById('loadUsers');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const toggles = document.querySelectorAll('.toggle');

const menuButton = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

let usersData = [];
loadButton.disabled = true;

menuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
});

function fetchUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(data => {
            usersData = data;
            renderTable();
        })
        .catch(() => {
            usersContainer.innerHTML = `
                <tr>
                    <td colspan="20">Erro ao carregar usuários</td>
                </tr>
            `;
        });
}

function getSelectedFields() {
    return Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

function renderTable() {
    const fields = getSelectedFields();

    const addressFields = fields.filter(f =>
        ['street', 'suite', 'zipcode'].includes(f)
    );

    const companyFields = fields.filter(f =>
        ['companyName', 'catchPhrase', 'bs'].includes(f)
    );

    const baseFieldNames = ['name', 'email', 'city'];

    const baseFields = fields.filter(f =>
        baseFieldNames.includes(f)
    );

    const simpleFields = fields.filter(f =>
        !baseFieldNames.includes(f) &&
        !addressFields.includes(f) &&
        !companyFields.includes(f)
    );

    let headerRow1 = `
    <tr>
        ${baseFields.map(f => `<th rowspan="2">${getTitle(f)}</th>`).join('')}
        ${simpleFields.map(f => `<th rowspan="2">${getTitle(f)}</th>`).join('')}
        ${addressFields.length ? `<th colspan="${addressFields.length}">Endereço</th>` : ''}
        ${companyFields.length ? `<th colspan="${companyFields.length}">Empresa</th>` : ''}
    </tr>
    `;

    let headerRow2 = `
    <tr>
        ${addressFields.map(f => `<th>${getTitle(f)}</th>`).join('')}
        ${companyFields.map(f => `<th>${getTitle(f)}</th>`).join('')}
    </tr>
    `;

    tableHead.innerHTML = headerRow1 + headerRow2;

    usersContainer.innerHTML = '';

    usersData.forEach(user => {
        usersContainer.innerHTML += `
            <tr>
                ${baseFields.map(f => `<td>${getValue(user, f)}</td>`).join('')}
                ${simpleFields.map(f => `<td>${getValue(user, f)}</td>`).join('')}
                ${addressFields.map(f => `<td>${getValue(user, f)}</td>`).join('')}
                ${companyFields.map(f => `<td>${getValue(user, f)}</td>`).join('')}
            </tr>
        `;
    });
}

function getTitle(field) {
    return {
        name: 'Nome',
        email: 'E-mail',
        city: 'Cidade',
        username: 'Nome de usuario',
        phone: 'Telefone',
        website: 'Website',
        street: 'Rua',
        suite: 'Suite',
        zipcode: 'CEP',
        companyName: 'Nome',
        catchPhrase: 'Slogan',
        bs: 'BS'
    }[field];
}

function getValue(user, field) {
    switch (field) {

        case 'name': return user.name;
        case 'email': return user.email;
        case 'city': return user.address.city;
        case 'username': return user.username;
        case 'phone': return user.phone;
        case 'website': return user.website;
        case 'street': return user.address.street;
        case 'suite': return user.address.suite;
        case 'zipcode': return user.address.zipcode;
        case 'companyName': return user.company.name;
        case 'catchPhrase': return user.company.catchPhrase;
        case 'bs': return user.company.bs;
        default: return '';
    }
}

//----------Botão e sua animação----------//

loadButton.addEventListener('mousedown', () => {
    if (loadButton.disabled) return;
    loadButton.classList.add('clicked');
});

loadButton.addEventListener('mouseup', () => {
    if (loadButton.disabled) return;

    loadButton.classList.remove('clicked');

    if (getSelectedFields().length === 0) return;
    fetchUsers();
});

loadButton.addEventListener('mouseleave', () => {
    loadButton.classList.remove('clicked');
});

//----------==========----------//

checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        updateLoadButtonState();
        //if (usersData.length) renderTable(); <--- se quiser que a tabela atualize sem precisar clicar no botão descomente esse trecho
    });
});

toggles.forEach(btn => {
    btn.addEventListener('click', () => {
        const group = document.getElementById(btn.dataset.target);
        const arrow = btn.querySelector('.arrow');

        const isOpen = group.classList.toggle('open');

        arrow.classList.toggle('open', isOpen);
    });
});

function updateLoadButtonState() {
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    loadButton.disabled = !anyChecked;
}
