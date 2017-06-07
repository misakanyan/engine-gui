import * as path from 'path';
import * as fs from 'fs';

export let run = () => {
    let canvas = document.getElementById("app") as HTMLCanvasElement;
    let stage = engine.run(canvas);
    let data:any;
    let bookRes:BookResourse[]=[];

    let items:BookItem[]=[];
    
    let projectUserPick = path.resolve(__dirname, "../../test-project");
    let configPath = path.join(projectUserPick, "data.config");

    if (!fs.existsSync(configPath)) {
        alert("该文件夹不是有效路径");
    }else{
        let dataContent = fs.readFileSync(configPath, "utf-8");
        try {
            data = JSON.parse(dataContent);
        }
        catch (e) {
            alert("配置文件解析失败！")
        }
        if(data){
            bookRes=data.resource;
            for (var i = 0; i < bookRes.length; i++) {
                let bookItem = new BookItem(bookRes[i].name, bookRes[i].id,i);
                items.push(bookItem);
            }
        }
    }

    let y=0;
    for(var item of items){
        item.x = 0;
        item.y = y;
        y += 5;
        item.addEventListener("onclick",()=>{
            item.desc.text="";
            item.bookRes.id="";
            item.bookRes.name="";
            items.splice(item.index,1);
        },this,false)
        stage.addChild(item);
    }

    let save=new engine.TextField();
    save.addEventListener("onclick",()=>{
        data.resource = bookRes;
        let dataContent = JSON.stringify(data, null, "\t");
        fs.writeFileSync(configPath, dataContent, "utf-8");
    },this,false);
}

class BookResourse{
    name:string;
    id:string;
    constructor(name:string,id:string){
        this.name=name;
        this.id=id;
    }
}

class BookItem extends engine.DisplayObjectContainer{
    bookRes:BookResourse;
    desc:engine.TextField;
    index:number;
    constructor(name:string,id:string,index:number){
        super();
        this.bookRes=new BookResourse(name,id);
        this.desc.text=name+" "+id;
        this.index=index;
    }
}