const fs = require('fs');
const filePath = '/Applications/MAMP/htdocs/images card/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Looking for the CSS changes to replace
content = content.replace(
`        @media (max-width: 768px) {
            .menu-btn { display: block; }
            .hbadge { display: none; }
            .ht p { display: none; } /* simplify header */
            .sb {
                position: absolute;
                left: -340px;
                top: 0;
                bottom: 0;
                z-index: 100;
                transition: left 0.3s ease;
                box-shadow: 5px 0 20px rgba(0,0,0,0.9);
            }`,
`        @media (max-width: 768px) {
            .menu-btn { display: block; }
            .hbadge { display: none; }
            .ht p { display: none; } /* simplify header */
            .sb {
                position: fixed;
                left: -340px;
                top: 65px;
                bottom: 0px;
                z-index: 1000;
                transition: left 0.3s ease;
                box-shadow: 5px 0 20px rgba(0,0,0,0.9);
            }`
);

fs.writeFileSync(filePath, content);
console.log('Done');
