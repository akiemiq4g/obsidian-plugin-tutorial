import { 
	Editor,
	Notice,
	Plugin,
	request, 
} from "obsidian";

interface ApiChunk{
    id: string;
    object: string;
    created: number;
    model: string;
    choices: [{
        finish_reason: null;
        delta: {
            content: string | null; 
        };
        message: {
			role: string | null;
			content: string | null;

		};
        sources: [];
        index: Number;
    }]
}

let stream = true;
let response = '';
export default class AAAppPlugin extends Plugin {

	async onload() {
		this.addRibbonIcon("wand", "AAAppPlugin", () => {
			request({
				url: "http://localhost:8001/v1/completions",
				method: "POST",
				body: JSON.stringify({
					use_context: true,
					prompt: "Hello, PrivateGPT, I'm over at Obsidian",
					stream: stream,
				})
			})
			.then((data) => { 
				if (stream) {
					let response: String = "";
					data.split("}\n").forEach(line => {
						if (!line.contains("[DONE]")) {
							let resChunk = JSON.parse(line.slice(6)+'}').choices[0].delta.content
							response += resChunk;


						}
						
						console.log(String(response))
					})
				} else {
					const response:ApiChunk = JSON.parse(data);
					return response.choices[0].message.content;
					
				}

				

				
				
			})
		})
			
		this.addCommand({
			id: "prompt",
			name: "Prompt",
			editorCallback: (editor: Editor) => {
				response = "Hello, World!";
				const userRequest = editor.getSelection();
				new Notice("Your request is my command.");
				console.log(userRequest);
				editor.replaceRange(
					response,
					editor.getCursor()
				);
				
			}
		})
	};



	async onunload() {
		console.log("AAAppPlugin unloaded");
    }
	
}