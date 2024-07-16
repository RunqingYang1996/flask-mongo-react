from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import torch
from PIL import Image
import requests
from transformers import AutoModelForCausalLM, AutoProcessor
torch.cuda.is_available()

# 下载并加载预训练的模型和处理器
model_id = "microsoft/phi-3-vision-128k-instruct"
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto", trust_remote_code=True, torch_dtype="auto", _attn_implementation='eager')
processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)

# 加载图片
url = "https://assets-c4akfrf5b4d3f4b7.z01.azurefd.net/assets/2024/04/BMDataViz_661fb89f3845e.png"  # 替换为你的图片URL
image = Image.open(requests.get(url, stream=True).raw)

# 预处理图片
messages = [ 
    {"role": "user", "content": "<|image_1|>\nWhat is shown in this image?"}, 
    {"role": "assistant", "content": "The chart displays the percentage of respondents who agree with various statements about their preparedness for meetings. It shows five categories: 'Having clear and pre-defined goals for meetings', 'Knowing where to find the information I need for a meeting', 'Understanding my exact role and responsibilities when I'm invited', 'Having tools to manage admin tasks like note-taking or summarization', and 'Having more focus time to sufficiently prepare for meetings'. Each category has an associated bar indicating the level of agreement, measured on a scale from 0% to 100%."}, 
    {"role": "user", "content": "Provide insightful questions to spark discussion."} 
] 
prompt = processor.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
pixel_values = processor(prompt, [image], return_tensors="pt").pixel_values

image = Image.open(requests.get(url, stream=True).raw) 

prompt = processor.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

inputs = processor(prompt, [image], return_tensors="pt").to("cuda:0") 

generation_args = { 
    "max_new_tokens": 500, 
    "temperature": 0.0, 
    "do_sample": False, 
} 

generate_ids = model.generate(**inputs, eos_token_id=processor.tokenizer.eos_token_id, **generation_args) 

# remove input tokens 
generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
response = processor.batch_decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0] 

print(response) 
