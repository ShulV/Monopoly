const playerBgColors = ["#d32020","#07b354","#1e92eb","#a20dff","#dbde23",];
const playerBorderColors = ["#862a2a","#177842","#2475b3","#6c1c9e","#9fa127",];
const playersColors = ["red","green","blue","purple","yellow"];
const playersIds = ["red-player", "green-player", "blue-player", "purple-player", "yellow-player"];
const playerPropBlockIds = ["player-red-block","player-green-block","player-blue-block","player-purple-block","player-yellow-block",];
const classColorName = ["red-text", "green-text", "blue-text", "purple-text", "yellow-text"];
const classBackgroundName = ["light-red-bg", "light-green-bg", "light-blue-bg", "light-purple-bg", "light-yellow-bg"];
const classBackgroundNumberName = ["red-bg-","pink-bg-","orange-bg-","cyan-bg-","blue-bg-","green-bg-","light-blue-bg-","purple-bg-","grey-bg-","cherry-bg-"];
const fieldNames = ["Start","Chanel","?","Hugo boss", "Tax income", "Audi","Adidas","?","Puma","Lacoste",
"Jail","Vkontakte","Rockstar games","Facebook","Twitter","Mercedes","Coca-cola","?","Pepsi","Fanta",
"Jackpot","American airlines","?","Lufthansa","British airways","Ford","McDonald's","BurgerKing","Rovio","KFC",
"GoToJail","Holiday Inn","Radisson","?","Novotel","Land rover","Tax luxury","Apple","?","Nokia"];
const rentMessages = ["Стройте филиалы, чтобы увеличить ренту.", 
"Рента зависит и от количества Разработчиков игр, которыми вы владеете.",
"Рента зависит от количества Автомобилей, которыми вы владеете."];
const monopolyNames = ["Автомобили","Парфюмерия","Одежда","Веб-сервисы","Напитки","Авиалинии","Рестораны","Отели","Электроника","Разработчики игр"];
const normalMonopolyRentList = [
[250,500,1000,2000],
[20,100,300,900,1600,2500],[60,300,900,2700,4000,5500],
[100,500,1500,4500,6250,7500],[140,700,2000,5500,7500,9500],
[180,900,2500,7000,8750,10500],[220,1100,3300,8000,9750,11500],
[260,1300,3900,9000,11000,12750],[350,1750,5000,11000,13000,15000],
[100,250]];
const lastMonopolyRentList = [[250,500,1000,2000],
[40,200,600,1800,3200,4500],[80,400,1000,3000,4500,6000],
[120,600,1800,5000,7000,9000],[160,800,2200,6000,8000,10000],
[200,1000,3000,7500,9250,11000],[240,1200,3600,8500,10250,12000],
[280,1500,4500,10000,12000,14000],[500,2000,6000,14000,17000,20000],
[100,250]];
const fieldCost = [null,600,null,600, null, 2000,1000,null,1000,1200,
null,1400,1500,1400,1600,2000,1800,null,1800,2000,
null,2200,null,2200,2400,2000,2600,2600,1500,2800,
null,3000,3000,null,3200,2000,null,3500,null,4000];

const fieldUpgradePrices = [null,500,500,750,1000,1250,1500,1750,2000,null];

const percentShift = [0,3.5,5.7,7.9,10.1,12.4,14.6,16.8,19,21.2,
    25,28.7,30.9,33,35.3,37.6,39.8,42,44.2,46.4,
    50,53.7,55.9,58.1,60.3,62.6,64.8,67,69.2,71.4,
    75,78.6,80.79,83,85.3,87.5,89.8,91.8,94.2,96.4];
const percentSingleField = 2.27272727;
const percentSingleAndHalfField = 3.40919091;

const startBonus = 1000;
const waitingTimeGoJail = 1500; //должно быть меньше, чем время анимации движения фишки (оно входит в waitingTimeGoJail)
const luxeryTax = 1000;
const incomeTax = 2000;

const rollDiceButtonId = "modal-btn-roll-dice";
const buyFieldButtonId = "modal-btn-buy-field";
const putUpAuctionButtonId = "modal-btn-auction";
const payTaxButtonId = "modal-btn-pay-tax";


let game;
let fields = [];
let rollDiceModal;
let buyFieldModal;


function addPlayersBlock(playerNumber, playerList){
    for(let i=0; i<playerNumber;i++){
        let div = document.createElement("div");
        div.setAttribute("class","player-block");
        div.setAttribute("id",playerPropBlockIds[i]);
        //name
        let nameSpan = document.createElement("span");
        nameSpan.setAttribute("class","name-text");
        let nameText = document.createTextNode(playerList[i].name);
        nameSpan.appendChild(nameText);
        div.appendChild(nameSpan);
        //money
        let moneySpan = document.createElement("span");
        moneySpan.setAttribute("class","money-text");
        let moneyText = document.createTextNode(playerList[i].money);
        moneySpan.appendChild(moneyText);
        div.appendChild(moneySpan);
        //timer
        let timerSpan = document.createElement("span");
        timerSpan.setAttribute("id","timer-text"+i);
        timerSpan.setAttribute("class","timer-text");
        let timerText = document.createTextNode(game.remainingMovingTime);
        timerSpan.appendChild(timerText);
        timerSpan.style.display = "none";
        div.appendChild(timerSpan);

        if (i==0){
            timerSpan.style.display = "flex";
            div.classList.add("active");
        }
        document.getElementById('players-block').appendChild(div);
    }
    
}

function addBgToPurchasedField(playerBuyer,fieldNumber){
    let playerNum = playerBuyer.number;
    let bgColorClass = classBackgroundName[playerNum];
    let fieldBlockId = "play-cell-"+(fieldNumber);
    let fieldBlock = document.getElementById(fieldBlockId);
    fieldBlock.classList.add(bgColorClass);
}

function setFieldParams(){
    // 1,11,21,31 - угловые поля
    let root = document.querySelector(':root');
    let cellSize = getComputedStyle(root).getPropertyValue('--cell-size');
    let floatCellSize = parseFloat(cellSize);
    let leftOffsetCellSize = 2*floatCellSize;
    let topOffsetCellSize = 2*floatCellSize;

    // play-cell-1, play-cell-2, ..
    for(let i=1; i<=40;i++){
        let cellClassName = "play-cell-" + String(i)
        let cellElem = document.getElementById(cellClassName);
        
        // угловые
        if (i==1 || i==11 || i==21 || i==31){
            cellElem.style.width = String(floatCellSize*2)+"%";
            cellElem.style.height = String(floatCellSize*2)+"%"; 
            if (i==1){
                cellElem.style.top = "0";
                cellElem.style.left = "0";
                continue; 
            }    
            if (i==11){
                cellElem.style.top = "0";
                cellElem.style.right = "0";
                continue; 
            } 
            if (i==21){
                cellElem.style.bottom = "0";
                cellElem.style.right = "0";
                continue; 
            } 
            if (i==31){
                cellElem.style.bottom = "0";
                cellElem.style.left = "0";
                continue; 
            } 
        }

        cellElem.style.width = String(floatCellSize*2)+"%";
        cellElem.style.height = String(floatCellSize)+"%";

        // верхняя линия
        if (i>1 && i<11 ){
            cellElem.style.top = String(floatCellSize*2)+"%";
            cellElem.style.left = String(leftOffsetCellSize)+"%";
            leftOffsetCellSize += floatCellSize;
            continue; 
        }
        // правая линия
        if (i>11 && i<21 ){
            cellElem.style.right = "0";
            cellElem.style.top = String(topOffsetCellSize)+"%";
            topOffsetCellSize += floatCellSize;
            continue; 
        }
        // нижняя линия
        if (i>21 && i<31 ){
            cellElem.style.bottom = "-"+String(floatCellSize)+"%";
            leftOffsetCellSize -= floatCellSize;
            cellElem.style.left = String(leftOffsetCellSize)+"%";
            continue;             
        }
        // левая линия
        if (i>31 && i<41 ){
            cellElem.style.left = "0";
            topOffsetCellSize -= floatCellSize;
            cellElem.style.top = String(topOffsetCellSize)+"%";
            continue; 
        }
        
    }
    // chat-block
    let chatBlock = document.getElementById('chat-block');
    chatBlock.style.top = String(floatCellSize*2)+"%";
    chatBlock.style.left = String(floatCellSize*2)+"%";
    chatBlock.style.height = String(floatCellSize*9)+"%";
    chatBlock.style.width = String(floatCellSize*9)+"%";
    // modal-block
    // 5% отступы относительно чат-блока
    let chatBlockWidth = chatBlock.clientWidth;
    let modalWidth = chatBlockWidth*0.9; //без боковых отступов
    let modalHeight = Math.floor(modalWidth / 3);
    let modalBlocks = document.getElementsByClassName('modal-block');
    for(let i=0; i<modalBlocks.length;i++){
        modalBlocks[i].style.width = modalWidth+"px";
        modalBlocks[i].style.height = modalHeight+"px";
        modalBlocks[i].style.marginTop = String(floatCellSize*2+3)+"%";
    }
    
}

function changeModalBtnText(buttonId,newText){
    let btnSpan = document.querySelector("#"+buttonId+" span");
    btnSpan.textContent = newText;
}

function createFields(game){
    for(let i=0;i<40;i++){
        let fieldNum = i+1;
        let monopolyNum = getMonopolyNumber(fieldNum);
        let name = fieldNames[i];
        let cost = fieldCost[i];
        if (cost){
            if(monopolyNum==0){
                //авто
                fields[i] = new CarField(name,cost,fieldNum,monopolyNum);
            }
            else if (monopolyNum==9){
                //гейм дев
                fields[i] = new GameDevsField(name,cost,fieldNum,monopolyNum);
            }
            else {
                //прокач. моны
                let rentList;
                if(isLastField(fieldNum)) rentList = lastMonopolyRentList[monopolyNum];
                else rentList = normalMonopolyRentList[monopolyNum];
                fields[i] = new ImprovableField(name,cost,fieldNum,monopolyNum,rentList);
            }
        }
        //спец поля
        else {
            let fieldType = getSpecialFieldType(fieldNum);
            fields[i] = new fieldType(name,fieldNum,game);
        }
    }
    // console.table(fields)
}

class ModalWindow{
    //объект игры всегда должен называться game
    /*
    modalType - строка
    0 - "rollDice" - бросить кубики (h-"Ваш ход",b-"Какой-то совет",f-1:"бросить кубики")
    1 - "buyField" - купить поле/аукцион (h-"Покупаем?",b-"Если вы откажетесь от покупки, то поле будет выставлено на общий аукцион",f-1:"купить за 100к",2:"на аукцион")
    2 - "payPlayerRent" - заплатить аренду (h-"Заплатите аренду.",b-"Попадая на чужие поля, вы должны выплачивать арнеду его владельцу",f-1:"заплатить 100к")
    3 - "payBankRent" - заплатить банку (h-"Заплатите банку.",b-"Вы можете получить деньги, продав филиалы или заложив фирму - для этого кликните на неё.",f-1:"заплатить 100к")
    4 - "auction" - аукцион (h-"На аукционе fieldName!",b-"Вы можете либо поднять ставку на 100к, либо покинуть аукцион.",f-1:"Поднять до 3100к", 2:"отказаться")
    5 - "infoImproveDeposit" - специальное окно (его место зависит от поля, для которого оно вызывается, данные этого поля нужно динамически заполнять перед показом окна)
    */
    constructor(modalType,game){
        let isOneButton = true;
        let sum;
        this.modalType = modalType;
        this.game = game;
        this.btnText2 = null;
        this.btnId2 = null;
        this.btnFuncName2 = null;
        this.headerId = "modal-header-"+modalType;
        this.bodyId = "modal-body-"+modalType;
        this.footerId = "modal-footer-"+modalType;
        switch(modalType) {
            case 'rollDice':
                this.modalName = "roll-the-dice-modal";
                this.headerText = "Ваш ход!";
                this.bodyText = "Совет.";
                this.btnText1 = "Бросить кубики";
                this.btnId1 = rollDiceButtonId;
                this.btnFuncName1 = "game.rollTheDice()"
                this.modalElement = this.createModalWindowElem(isOneButton);
                break;
            case 'buyField':
                this.modalName = "buy-field-modal";
                this.headerText = "Покупаем?";
                this.bodyText = "Попадая на чужие поля, вы должны выплачивать аренду его владельцу.";
                sum = 100; //
                this.btnText1 = "Купить за " + sum + "k";
                this.btnText2 = "На аукцион.";
                this.btnId1 = buyFieldButtonId;
                this.btnId2 = putUpAuctionButtonId;
                this.btnFuncName1 = "game.currentPlayer.buyField()";
                this.btnFuncName2 = "game.currentPlayer.putUpAuctionField()";
                isOneButton = false;
                this.modalElement = this.createModalWindowElem(isOneButton);
                break;
            //TODO
            case 'payPlayerRent':
                this.modalElement = this.createModalWindowElem(isOneButton);
                break;
            case 'payTax':
                this.modalName = "pay-tax-modal";
                this.headerText = "Заплатите Банку";
                this.bodyText = "Иногда приходится выплачивать налог банку.";
                this.btnText1 = "Заплатить " + incomeTax + "k";
                this.btnId1 = payTaxButtonId;
                this.btnFuncName1 = "game.currentPlayer.payTax()";
                this.modalElement = this.createModalWindowElem(isOneButton);
                break;
            case 'auction':
                this.modalElement = this.createModalWindowElem(isOneButton);
                break;
            case 'info':
                createModalInfoElem();
                break;
            default:
                break;
          }
        
    }
    createModalInfoElem(){
        const modal = document.createElement('div');
        modal.classList.add("modal-info-block");
        modal.setAttribute('id',"modal-info-block");
        modal.insertAdjacentHTML('afterbegin',`
            
//HTML
            `);

        document.getElementById("play-field").appendChild(modal);

        if(isOneButton) this.deleteSecondButton();

        document.getElementById(this.modalName).classList.add(this.modalName);
        document.getElementById(this.headerId).classList.add("modal-header");
        document.getElementById(this.bodyId).classList.add("modal-body");
        document.getElementById(this.footerId).classList.add("modal-footer");
        
        let btn1 = document.getElementById(this.btnId1);
        btn1.classList.add(this.btnId1);
        btn1.classList.add("modal-btn");
        return modal;
    }
    
    createModalWindowElem(isOneButton){
        const modal = document.createElement('div');
        modal.classList.add("modal-block");
        modal.setAttribute('id',this.modalName);
        modal.insertAdjacentHTML('afterbegin',`
            
                <div id=${this.headerId}>
                    <span>${this.headerText}</span>
                </div>
                <div id=${this.bodyId}>
                    <p>${this.bodyText}</p>
                </div>
                <div id=${this.footerId}>
                    <div id=${this.btnId1} class="modal-btn modal-small-btn" onclick=${this.btnFuncName1}>
                        <span>${this.btnText1}</span>
                    </div>
                    <div id=${this.btnId2} class="modal-btn modal-small-btn" onclick=${this.btnFuncName2}>
                        <span>${this.btnText2}</span>
                    </div>
                </div>
            `);

        document.getElementById("play-field").appendChild(modal);

        if(isOneButton) this.deleteSecondButton();

        document.getElementById(this.modalName).classList.add(this.modalName);
        document.getElementById(this.headerId).classList.add("modal-header");
        document.getElementById(this.bodyId).classList.add("modal-body");
        document.getElementById(this.footerId).classList.add("modal-footer");
        
        let btn1 = document.getElementById(this.btnId1);
        btn1.classList.add(this.btnId1);
        btn1.classList.add("modal-btn");
        return modal;
    }
    deleteSecondButton(){
        let btn2 = document.getElementById(this.btnId2);
        document.getElementById(this.footerId).removeChild(btn2);
        document.getElementById(this.btnId1).classList.remove("modal-small-btn");
    }
    open(){
        document.getElementById(this.modalName).classList.add("open");
        if(this.modalType == "buyField" || this.modalType == "payTax")
            this.game.startBuyFieldTimer(this.game.currentPlayer.number);

    }
    close(){
        document.getElementById(this.modalName).classList.remove("open");
        clearTimeout(this.game.purchaseTimerId);
        clearInterval(this.game.purchaseTimerId2);
    }
}



function createModals(game){
    rollDiceModal = new ModalWindow("rollDice",game);
    buyFieldModal = new ModalWindow("buyField",game);
    payTaxModal = new ModalWindow("payTax",game);
}


function createPlayer(id,playerNumber){
    let circle = document.createElement("div");
    circle.style.height = "25px";
    circle.style.width = "25px";
    circle.style.position = "absolute";
    circle.style.left = "0px";
    circle.style.top = "0px";
    circle.style.border = " 2px solid " + playerBorderColors[playerNumber];
    circle.style.borderRadius = "50%";
    circle.style.background = playerBgColors[playerNumber];
    // circle.style.boxShadow = "20px 20px 50px 0px rgba(0, 0, 0, 1);"
    circle.setAttribute("id",id);
    circle.setAttribute("class",id);
    //circle.style.zIndex = 999999;
    document.getElementById('play-field').appendChild(circle);
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function doScrollDown(scrollBlockName) {
    document.getElementById(scrollBlockName).scrollTop = 999999;
}

function getMonopolyNumber(fieldNum){
    let fl = parseInt(fieldNum);
    if (fl == 1 || fl == 11 || fl == 21 || fl == 31){
        return null; //угловое поле
    }
    if (fl == 3 || fl == 8 || fl == 18 || fl == 23 || fl == 34 || fl == 39){
        return null; //поле "?"
    }
    if (fl == 5 || fl == 37) {
        return null; //налоговые поля
    }
    if (fl == 6 || fl == 16 || fl == 26 ||  fl == 36){
        return 0; //мона автомобилей
    }
    if (fl == 13 || fl == 29){
        return 9; //мона разработчиков игр
    }
    if (fl < 5) {
        return 1; //мона парфюмерии
    }
    if (fl < 11) {
        return 2; //мона одежды
    }
    if (fl < 16) {
        return 3; //мона веб-сервисов
    }
    if (fl < 21) {
        return 4; //мона напитков
    }
    if (fl < 26) {
        return 5; //мона авиалиний
    }
    if (fl < 31) {
        return 6; //мона ресторанов
    }
    if (fl < 36) {
        return 7; //мона отелей
    }
    else return 8; //мона электроники
}

function getSpecialFieldType(fieldNum){
    let fl = parseInt(fieldNum);
    if (fl == 1){
        return StartField; //угловое поле (Start)
    }
    if (fl == 11){
        return JailVisitingField; //угловое поле (Jail visiting)
    }
    if (fl == 21){
        return JackpotField; //угловое поле (Jackpot)
    }
    if (fl == 31){
        return GoToJailField; //угловое поле (Jail)
    }
    if (fl == 3 || fl == 8 || fl == 18 || fl == 23 || fl == 34 || fl == 39){
        return ChanceField; //поле "?"
    }
    if (fl == 5 || fl == 37) {
        return TaxField; //налоговые поля
    }
}

function isLastField(fieldNum){
    let fl = fieldNum;
    if(fl==4 || fl == 10 || fl == 15|| fl == 20 || 
        fl == 25 || fl == 30 || fl == 35 || fl == 40) return true;
    return false
}

// функция выдает путь по квадрату относительно размера экрана пользователя
function setScalablePath(playerNum){
    let players = [];
    for(let i=0;i<playerNum;i++){
        players[i] = document.querySelector('.'+playersIds[i]);
    // "M10 10 h 180 v 180 h -180 Z"
    // M x y - установка координат карандаша
    // h - горизональная линия x+10 (H - абсолютное значение 10)
    // v - вертикальная линия y+10 (V - абсолютное значение 10)
    // Z - линия в от последней точки до начальной
  
    // получение пути
    let scalePath = "";
    let rect = document.getElementById("play-field");
    let rectStyle = getComputedStyle(rect);
    let fieldSize = parseInt(rectStyle.height);
    
    let marginLeftTop = Math.trunc(fieldSize * 0.071);//

    let pathSize = fieldSize-2*marginLeftTop;//14% ширина/высота углового поля
    
    scalePath = "M"+String(marginLeftTop)+" "+String(marginLeftTop)+
    " h "+pathSize+" v "+pathSize+" h "+(-pathSize)+" Z";
    
    // установка параметров для пути и svg
    // PATH.setAttribute('d', scalePath);
    scalePath = "'"+scalePath+"'";
    players[i].style.setProperty('--path1', scalePath);
    };
    
};

class PurchasedField {
    constructor(name,cost,fieldNum,monopolyNum){
        this.fieldName = name;
        
        
        this.cost = cost;
        this.deposit = this.cost / 2;
        this.buyback = this.deposit * 1.2;
        this.fieldNum = fieldNum;
        this.monopolyNum = monopolyNum;
        this.rentLevel = 0;

        if(monopolyNum == 0) {
            this.rentMessage = rentMessages[2];
            this.maxFieldsInMonopoly = 4;
        }
        else if(monopolyNum == 9) {
            this.rentMessage = rentMessages[1];
            this.maxFieldsInMonopoly = 2;
        }
        else {
            this.rentMessage = rentMessages[0];
            if(monopolyNum == 1 || monopolyNum == 8) this.maxFieldsInMonopoly = 2; //парфюмерия или электроника
            else this.maxFieldsInMonopoly = 3;
        }

        this.owner = null;
        this.isMonopoly = false;
    }

    getRent(){

    }
}

class SpecialField{
    constructor(name,fieldNum,game){
        this.name = name;
        this.fieldNum = fieldNum;
        this.game = game;
    }
}

class StartField extends SpecialField{
    constructor(name,fieldNum,game){
        super(name,fieldNum,game);
        this.startBonus = startBonus;
    }
    addStartBonus(){
        game.currentPlayer.money += this.startBonus;
        game.addMessage("startFieldBonus");
    }
}

class TaxField extends SpecialField{
    constructor(name,fieldNum,game){
        super(name,fieldNum,game);
        this.luxeryTax = luxeryTax;
        this.incomeTax = incomeTax;
    }

}

class ChanceField extends SpecialField{
    constructor(name,fieldNum,game){
        super(name,fieldNum,game);
    }
}

class JailVisitingField extends SpecialField{
    constructor(name,fieldNum,game){
        super(name,fieldNum,game);
    }
}

class JackpotField extends SpecialField{
    constructor(name,fieldNum,game){
        super(name,fieldNum,game);
    }
}

class GoToJailField extends SpecialField{
    constructor(name,fieldNum,game){
        super(name,fieldNum,game);
    }
    goToJail(){
        game.movePlayer(-20); // возврат до поля тюрьмы
        game.addMessage("goToJail");
        
    }
}





class ImprovableField extends PurchasedField{
    constructor(name,cost,fieldNum,monopolyNum,rentList){
        super(name,cost,fieldNum,monopolyNum);
        this.rentList = rentList;
        this.upgradePrice = fieldUpgradePrices[monopolyNum];
        //rentLevel [0..5] max=5
    }
}

class GameDevsField extends PurchasedField{
    constructor(name,cost,fieldNum,monopolyNum){
        super(name,cost,fieldNum,monopolyNum);
        this.multiplierRentList = normalMonopolyRentList[9];
        //rentLevel [0..1] max=1
    }
}

class CarField extends PurchasedField{
    constructor(name,cost,fieldNum,monopolyNum){
        super(name,cost,fieldNum,monopolyNum);
        this.rentList = normalMonopolyRentList[0];
        //rentLevel [0..3] max=3
    }
}

class Player{

    constructor(name, money, number) {
      this.name = name;
      this.money = money;
      this.place = 0;
      this.number = number;
      this.color = playersColors[number];
      this.id = playersIds[number];
      this.currentFieldNum = 1;
      this.currentFieldObj = fields[0];
      this.currentLap = 0;
      this.fieldsPassedNumber = 0;
      this.isLoser = false;
      
      this.purchasedFields = [];
      this.game = null;

      let id = String(this.id);
      createPlayer(id,number);
    }
    addGameInProp(game){
        this.game = game;
    }


    buyField(){
        let fieldCost = this.currentFieldObj.cost;
        if (this.money >= fieldCost){
            this.game.outerResolve();
            this.game.pressedModalButton = true;
            this.money -= fieldCost;
            this.purchasedFields.push(this.currentFieldObj);
            this.currentFieldObj.owner = this;
            addBgToPurchasedField(this,this.currentFieldObj.fieldNum);
            this.game.addMessage("buyingField");
            buyFieldModal.close();
        }
        else{
            alert("Вам не хватило денег на покупку!")
        }

        
    }

    payTax(){
        let tax;
        if (this.currentFieldNum == 5) {
            tax=2000;
        }
        else {
            tax = 1000;
        }
        
        if (this.money >= tax){
            this.game.outerResolve();
            this.game.pressedModalButton = true;
            this.money -= tax;
            this.game.outerResolve();
            this.game.pressedModalButton = true;
            this.game.addMessage("paidExpenses");
            payTaxModal.close();
            }
        else
        {
            alert("Недостаточно денег!")
        }
    }

    putUpAuctionField(){
        this.game.outerResolve();
        this.game.pressedModalButton = true;
        this.game.addMessage("putUpAuction");
        buyFieldModal.close();
    }
  
  }

  function sleep(gameObj,ms) {
    return new Promise(resolve => {
      gameObj.outerResolve = resolve;
      gameObj.purchaseTimerId = setTimeout(resolve, ms);
    });
    
  }

class Game {
    constructor(playerNumber,playerList) {
        this.playerNumber = playerNumber;
        this.curNonLosersNumber = playerNumber;
        this.playerList = playerList;
        this.currentPlayer = this.playerList[0]; 
        this.playersQueue = []; //очередь игроков  
        //таймер хода
        this.startMovingTime;
        this.maxMovingTime=60; //максимальное время хода
        this.Time=0; //время старта таймера ожидания хода
        this.remainingMovingTime = this.maxMovingTime; //оставшееся время таймера хода
        this.movingTimerId; //таймер времени ожидания хода
        //таймер покупки
        this.startBuyFieldTime;
        this.maxPurchaseTime = 30; //максимальное вреия покупки поля
        this.purchaseTimerId; //таймер времени ожидания покупки для setTimeout (для ожидания)
        this.purchaseTimerId2; //таймер времени ожидания покупки для setInterval (для отображения)
        this.outerResolve; //хранение функции для промиса у таймера покупки
        
        this.pressedModalButton = false;

        for(let i=0;i<playerNumber;i++){
            this.playersQueue.push(playerList[i]);
        }  
      }
      
    async rollTheDice(){
        let tax;
        let newBtnText;
        let wasRemovedPlayer = false;
        rollDiceModal.close();

        clearInterval(this.movingTimerId);
        clearInterval(this.purchaseTimerId2);
        //получение двух случайных чисел
        let randomNum1 = randomInteger(1, 6);
        let randomNum2 = randomInteger(1, 6);
        let randomSum = randomNum1 + randomNum2;
        this.addMessage("rollDice",randomNum1,randomNum2);
        this.movePlayer(randomSum);
   
        
        let curField = fields[this.currentPlayer.currentFieldNum-1]
        //прокачиваемое и не купленное поле
        if((curField instanceof PurchasedField) && !curField.owner){
            this.addMessage("gotOnField");
            let fieldCost = this.currentPlayer.currentFieldObj.cost;
            newBtnText = "Купить за " + fieldCost + "k";
            changeModalBtnText(buyFieldButtonId,newBtnText);
            buyFieldModal.open();
            
            await sleep(this,this.maxPurchaseTime*1000);

            if(this.pressedModalButton){
                this.pressedModalButton = false;
            }
            else {
                this.playerLose();
                buyFieldModal.close();
                wasRemovedPlayer = true;
            }   
        }
        //поле старт
        else if (curField instanceof StartField){
            this.currentPlayer.currentFieldObj.addStartBonus();
        }
        //поле полиция отправляет в тюрьму
        else if (curField instanceof GoToJailField){
            await sleep(this,waitingTimeGoJail);
            this.currentPlayer.currentFieldObj.goToJail();
        }
        //поле посещение тюрьмы
        else if (curField instanceof JailVisitingField){
            this.addMessage("jailVisiting")
        }
        //поле выплаты налога
        else if (curField instanceof TaxField){
            
            if (curField.fieldNum == 5) {
                tax = incomeTax;
                this.addMessage("payIncomeTax");
            }
            else {
                tax = luxeryTax;
                this.addMessage("payLuxeryTax");
            }  
            newBtnText = "Заплатить " + tax + "k";
            changeModalBtnText(payTaxButtonId,newBtnText);
            payTaxModal.open();
            await sleep(this,this.maxPurchaseTime*1000);
            if(this.pressedModalButton){
                this.pressedModalButton = false;
            }
            else {
                this.playerLose();
                payTaxModal.close();
                wasRemovedPlayer = true;
            } 
        }
        //поле казино
        else if (curField instanceof JackpotField){
            this.addMessage("gotOnJackpot");
        }
        //поле казино
        else if (curField instanceof ChanceField){
            this.addMessage("gotOnChance");
        }
        
        //поле 
        if (!wasRemovedPlayer){
            this.playersQueue.shift();
            this.playersQueue.push(this.currentPlayer);
            this.updatePlayersBlock();     
            this.currentPlayer = this.playersQueue[0];

            wasRemovedPlayer = false; //возврат состояния флага
        }
        let curPlayerNumber = this.playersQueue[0].number;
        this.startMovingTimer(curPlayerNumber);
        
        rollDiceModal.open();
    }

    playerLose(){
        clearInterval(this.movingTimerId);
        clearInterval(this.purchaseTimerId2);
        this.addMessage("surrender");
        this.playersQueue.shift();
        this.playersQueue.push(this.currentPlayer);
        this.currentPlayer = this.playersQueue[0];
        this.updatePlayersBlock();
        
        
        let playerLoser = this.playersQueue.pop();
        playerLoser.isLoser = true;


        let circle = document.getElementById(playerLoser.id);
        document.getElementById('play-field').removeChild(circle);
        let playerLoserBlock = document.getElementById(playerPropBlockIds[playerLoser.number]);
        playerLoserBlock.classList.add("player-is-loser");

        this.curNonLosersNumber--;
        if (this.curNonLosersNumber == 1) {
            this.playerWin();
            return;
        }
        this.startMovingTimer(this.currentPlayer.number);
    }

    playerWin(){
        let winnerName = this.playersQueue[0].name;
        alert(winnerName + " Победил!");
    }

    addMessage(msgType,num1=undefined,num2=undefined){
        /*
        msgType: 
        "rollDice" - бросок кубика (используются параметры num1,num2)
        "gotOnField" - попадание на поле
        "surrender" - игрок сдается/проигрывает
        "buyingField" - покупка поля
        "moneyLap" - добавление денег за проход очереднего круга
        "startFieldBonus" - добавление денег за остановку на старте
        "goToJail" - отправление в тюрьму
        "jailVisiting" - посещение тюрьмы
        "payIncomeTax" - обязанность заплатить подоходный налог
        "payLuxeryTax" - обязанность заплатить налог на роскошь
        "paidExpenses" - оплата расходов (подоходного или на роскошь)
        "putUpAuction" - высталение на аукцион
        "gotOnJackpot" - попадание на поле казино
        "gotOnChance" - попадание на поле шанс
        
        */
        let colorClass = classColorName[this.currentPlayer.number];
        let par = document.createElement("p");
        let nameText = document.createElement("span");
        nameText.setAttribute("class",colorClass);
        let text = document.createTextNode(this.currentPlayer.name);
        nameText.appendChild(text);
        par.appendChild(nameText);
        let msgText;
        let fieldNum = this.currentPlayer.currentFieldNum;
        switch(msgType){
        case "rollDice":
            msgText = " выбрасывает "+String(num1)+":"+String(num2);
            break;
        case "gotOnField":
            msgText = " попадает на поле " + fieldNames[fieldNum-1] + " и задумывается о покупке";
            break;
        case "surrender":
            msgText = " сдаётся";
            break;
        case "buyingField":
            let money = this.currentPlayer.currentFieldObj.cost;
            msgText = " покупает " + fieldNames[fieldNum-1] + " за " + money + "k";
            break;
        case "moneyLap":
            let moneyForLap = 2000;
            msgText = " проходит очередной круг и получает " + moneyForLap + "k";
            break;  
        case "startFieldBonus":
            msgText = " останавливается на поле \"Старт\" и получает бонус в размере " + startBonus + "k";
            break;
        case "goToJail":
            msgText = " арестован полицией и отправляется в тюрьму";
            break;
        case "jailVisiting":
            msgText = " посещает полицейский участок с экскурсией";
            break;
        case "payIncomeTax":
            msgText = " попадает на поле \"Подоходный налог\" и должен заплатить Банку " + incomeTax + "k";
            break;
        case "payLuxeryTax":
            msgText = " попадает на поле \"Налог на роскошь\" и должен заплатить Банку " + luxeryTax + "k";
            break;
        case "paidExpenses":
            msgText = " оплачивает расходы";
            break;
        case "putUpAuction":
            let fieldName = this.currentPlayer.currentFieldObj.fieldName;
            msgText = " выставляет " + fieldName + " на аукцион.";
            break;
        case "gotOnJackpot":
            msgText = " попадает на поле \"Казино\"";
            break;
        case "gotOnChance":
            msgText = " попадает на поле \"Шанс\"";
            break;
        }
        
        text = document.createTextNode(msgText);
        par.appendChild(text);
        document.getElementById('chat-block').appendChild(par);
        doScrollDown('chat-block');
    }

    addMoneyLap(){
        this.currentPlayer.money += 2000;
        this.addMessage("moneyLap");
    }

    startMovingTimer(curPlayerNumber){
        let timerSpan = document.getElementById("timer-text"+curPlayerNumber);
        timerSpan.textContent = this.maxMovingTime;
        this.startMovingTime = new Date().getTime();//время старта в милисекундах
        this.movingTimerId  = setInterval(
        ()=>{
            let curTime = new Date().getTime();
            let remainingMovingTime = this.maxMovingTime - Math.floor((curTime - this.startMovingTime)/1000);
            timerSpan = document.getElementById("timer-text"+curPlayerNumber);
            timerSpan.textContent = remainingMovingTime;
            if(remainingMovingTime<=0) this.playerLose();
        }, 1000);   
    }

    startBuyFieldTimer(curPlayerNumber){
        let timerSpan = document.getElementById("timer-text"+curPlayerNumber);
            timerSpan.textContent = this.maxPurchaseTime;
        this.startBuyFieldTime = new Date().getTime();//время старта в милисекундах
        this.purchaseTimerId2  = setInterval(
        ()=>{
            let curTime = new Date().getTime();
            let remainingPurchaseTime = this.maxPurchaseTime - Math.floor((curTime - this.startBuyFieldTime)/1000);
            timerSpan = document.getElementById("timer-text"+curPlayerNumber);
            timerSpan.textContent = remainingPurchaseTime;
            if(remainingPurchaseTime<=0) clearInterval(this.purchaseTimerId2);
        }, 1000);   
    }

    movePlayer(randomSum){
        // if(this.currentPlayer.currentFieldNum == 1) {
        //     randomSum=4;
        // }
        let playerNumber = this.currentPlayer.number;

        this.currentPlayer.fieldsPassedNumber += randomSum;
        let prevLap = this.currentPlayer.currentLap;
        this.currentPlayer.currentLap = Math.floor(this.currentPlayer.fieldsPassedNumber/40);
        if(prevLap<this.currentPlayer.currentLap) {
            this.addMoneyLap();
        }
        //изменение параметров фишки (анимация)
        let player = document.querySelector('.'+playersIds[playerNumber]);
        let curLen = getComputedStyle(player).getPropertyValue('--distance'+(playerNumber+1));

        this.currentPlayer.currentFieldNum = this.currentPlayer.fieldsPassedNumber % 40 + 1;
        this.currentPlayer.currentFieldObj = fields[this.currentPlayer.currentFieldNum-1];

        let curFieldNum = this.currentPlayer.currentFieldNum;

        curLen = this.currentPlayer.currentLap*100+percentShift[curFieldNum-1];
        player.style.setProperty('--distance'+(playerNumber+1), curLen);
    }

    updatePlayersBlock(){
        this.updateMoneyText();
        this.updateTimerText();
        this.updateBackground();        
    }

    updateBackground(){
        let prevPlayerNumber = this.playersQueue[this.curNonLosersNumber-1].number;
        let curPlayerNumber = this.playersQueue[0].number;
        let prevDiv = document.getElementById(playerPropBlockIds[prevPlayerNumber]);
        prevDiv.classList.remove("active");
        let curDiv = document.getElementById(playerPropBlockIds[curPlayerNumber]);
        curDiv.classList.add("active");

    }

    updateMoneyText(){
        for(let i=0; i<this.curNonLosersNumber;i++){
            let playerNum = this.playersQueue[i].number;
            let div = document.getElementById(playerPropBlockIds[playerNum]);
            let moneySpan = div.querySelector(".money-text");
            moneySpan.textContent = this.playersQueue[i].money; 
        }
    }

    updateTimerText(){
        let prevPlayerNumber = this.playersQueue[this.curNonLosersNumber-1].number;
        let curPlayerNumber = this.playersQueue[0].number;
        let timerSpan = document.getElementById("timer-text"+prevPlayerNumber);
        timerSpan.textContent = this.maxMovingTime;
        timerSpan.style.display = "none";
        let curTimerSpan = document.getElementById("timer-text"+curPlayerNumber);
        curTimerSpan.style.display = "flex";
    }

}

function createGame(playerNum,playerData){
    let players = [];
    for(let i=0;i<playerNum;i++){
        players[i] = new Player(playerData[i][0],playerData[i][1],playerData[i][2]);
    }
    
    game = new Game(playerNum,players);
    for(let i=0;i<playerNum;i++){
        players[i].addGameInProp(game);
    }
}

function startGame(){
    let playerNum = 5;
    let playerData = [["Victor",1000,0],["ILON MASK",15000,1],["Гена",15000,2],["Галкин",15000,3],["Семён",15000,4]];
    
    createGame(playerNum, playerData);
    createFields(game);
    addPlayersBlock(playerNum,game.playerList);

    createModals(game);
    setScalablePath(playerNum);
    setFieldParams();
    rollDiceModal.open();
    game.startMovingTimer(0);
    
}


