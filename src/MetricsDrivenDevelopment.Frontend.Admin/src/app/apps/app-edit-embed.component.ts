import { App } from "./app.model";
import { EditorComponent } from "../shared";
import {  AppDelete, AppEdit, AppAdd } from "./app.actions";

const template = require("./app-edit-embed.component.html");
const styles = require("./app-edit-embed.component.scss");

export class AppEditEmbedComponent extends HTMLElement {
    constructor() {
        super();
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    static get observedAttributes() {
        return [
            "app",
            "app-id"
        ];
    }
    
    connectedCallback() {        
        this.innerHTML = `<style>${styles}</style> ${template}`; 
        this._bind();
        this._setEventListeners();
    }
    
    private async _bind() {
        this._titleElement.textContent = this.app ? "Edit App": "Create App";

        if (this.app) {                
            this._nameInputElement.value = this.app.name;  
        } else {
            this._deleteButtonElement.style.display = "none";
        }     
    }

    private _setEventListeners() {
        this._saveButtonElement.addEventListener("click", this.onSave);
        this._deleteButtonElement.addEventListener("click", this.onDelete);
    }

    private disconnectedCallback() {
        this._saveButtonElement.removeEventListener("click", this.onSave);
        this._deleteButtonElement.removeEventListener("click", this.onDelete);
    }

    public onSave() {
        const app = {
            id: this.app != null ? this.app.id : null,
            name: this._nameInputElement.value
        } as App;
        
        this.dispatchEvent(new AppAdd(app));            
    }

    public onDelete() {        
        const app = {
            id: this.app != null ? this.app.id : null,
            name: this._nameInputElement.value
        } as App;

        this.dispatchEvent(new AppDelete(app));         
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "app-id":
                this.appId = newValue;
                break;
            case "app":
                this.app = JSON.parse(newValue);
                if (this.parentNode) {
                    this.appId = this.app.id;
                    this._nameInputElement.value = this.app.name != undefined ? this.app.name : "";
                    this._titleElement.textContent = this.appId ? "Edit App" : "Create App";
                }
                break;
        }           
    }

    public appId: any;
    public app: App;
    
    private get _titleElement(): HTMLElement { return this.querySelector("h2") as HTMLElement; }
    private get _saveButtonElement(): HTMLElement { return this.querySelector(".save-button") as HTMLElement };
    private get _deleteButtonElement(): HTMLElement { return this.querySelector(".delete-button") as HTMLElement };
    private get _nameInputElement(): HTMLInputElement { return this.querySelector(".app-name") as HTMLInputElement;}
}

customElements.define(`ce-app-edit-embed`,AppEditEmbedComponent);
