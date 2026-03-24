import re

def summarize_chunk(tokenizer, model, text):
    input_text = "summarize: " + text
    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        max_length=512,
        truncation=True
    )
    outputs = model.generate(
        **inputs,
        max_new_tokens=128,
        num_beams=4,
        early_stopping=True
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def summarize_long_text(tokenizer, model, text, chunk_size=200):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)

    all_points = []
    seen = set()

    for chunk in chunks:
        summary = summarize_chunk(tokenizer, model, chunk)
        sentences = re.split(r'(?<=[.!?]) +', summary.strip())
        for s in sentences:
            s = s.strip()
            if s and s not in seen:
                seen.add(s)
                all_points.append(f"• {s}")

    return "\n".join(all_points)