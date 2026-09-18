---
title: 'How good is Gemma 4 at Korean?'
description: 'Benchmarked Korean capabilities of Gemma 4'
pubDate: 2026-09-18
heroImage: '../../assets/bonsai-2026-09-18T03-54-29-417Z.webp'
---

I was just curious about local LLM's capabilities of Korean, so i decided to benchmark them! The first model i choose wass Gemma 4 26B A4B. Gemma 4 is known for it's language capabilities and 26B A4B is the best i can run with my PC.

The benchmark I choose is KOBALT from Seoul National University Natural Language Processing Laboratory. It consists of 700 expert-written multiple-choice questions covering 24 fine-grained linguistic phenomena across five core linguistic domains:

- Syntax (300)
- Semantics (215)
- Pragmatics (81)
- Phonetics/Phonology (62)
- Morphology (42)

It might be outdated for current frontier models, but I think it is still relevant for small language models.

For the specific model I used a GGUF from unsloth: unsloth/gemma-4-26B-A4B-it-qat-GGUF UD_Q4_K_XL

- **Protocol**: upstream-official inference protocol — verbatim Korean CoT prompt (template hash pinned per run), greedy decoding (`temperature: 0.0`, `do_sample: false`), `max_new_tokens: 2048`, upstream two-stage answer extraction (`정답은\s*(.*?)\s*입니다` → distinct A–J letters), strict 0/1 exact match.
- **Harness**: [`kobalt-eval`](https://github.com/snunlp/KoBALT-700) protocol replication — full config snapshots, per-item predictions, and logs are self-describing per run.

## Overall & per-domain accuracy

| **Model**                  | Avg   | Syntax | Semantics | Pragmatics | Morphology | Phonetics |
| -------------------------- | ----- | ------ | --------- | ---------- | ---------- | --------- |
| Claude-3-7-sonnet          | 0.61  | 0.66   | 0.66      | 0.64       | 0.36       | 0.31      |
| **gemma-4-26B-A4B-it-qat** | 0.587 | 0.647  | 0.623     | 0.444      | 0.435      | 0.476     |
| Claude-3-5-sonnet          | 0.52  | 0.52   | 0.65      | 0.51       | 0.36       | 0.24      |
| DeepSeek-V3-XL             | 0.47  | 0.49   | 0.56      | 0.42       | 0.24       | 0.29      |
| GPT-4o                     | 0.44  | 0.45   | 0.55      | 0.40       | 0.17       | 0.26      |
| DeepSeek-V3                | 0.43  | 0.41   | 0.57      | 0.42       | 0.26       | 0.23      |
| C4ai-command-a-03          | 0.36  | 0.30   | 0.52      | 0.36       | 0.24       | 0.18      |
| Gemma-3-27b                | 0.35  | 0.30   | 0.53      | 0.27       | 0.24       | 0.11      |
| Qwen2.5-72B                | 0.37  | 0.33   | 0.51      | 0.37       | 0.24       | 0.18      |
| Mistral-Small-24B          | 0.32  | 0.27   | 0.49      | 0.30       | 0.21       | 0.11      |
| Llama-3.3-70B              | 0.32  | 0.25   | 0.50      | 0.35       | 0.17       | 0.15      |
| Qwen2.5-32B                | 0.30  | 0.23   | 0.49      | 0.28       | 0.21       | 0.11      |
| Gemma-2-9b                 | 0.21  | 0.17   | 0.34      | 0.15       | 0.12       | 0.11      |
| Aya-expanse-32b            | 0.25  | 0.21   | 0.40      | 0.12       | 0.10       | 0.16      |
| Aya-expanse-8b             | 0.19  | 0.15   | 0.33      | 0.11       | 0.12       | 0.06      |
| Qwen2.5-7B                 | 0.19  | 0.14   | 0.33      | 0.11       | 0.19       | 0.06      |
| Llama-3.1-8B               | 0.17  | 0.13   | 0.26      | 0.12       | 0.10       | 0.11      |
| Ministral-8B               | 0.17  | 0.11   | 0.29      | 0.15       | 0.10       | 0.11      |
| Mistral-7B-v0.3            | 0.12  | 0.11   | 0.16      | 0.11       | 0.14       | 0.06      |

## Notable observations

- **gemma-4-26B-A4B-it (QAT GGUF, 4B active params)** reaches 0.587 — within ~2 points of the paper's best overall (Claude-3.7-Sonnet, 0.61) and well above the best upstream open-weights entry (DeepSeek-V3-XL, 0.47) and upstream gemma-3-27b (0.35). QAT quantization did not visibly degrade linguistic-competence performance.
- **Difficulty gradient** (by official item `Level`): L1 0.929 → L2 0.727 → L3 0.275 — near-ceiling on easy items, sharp collapse on hard ones.
- **Domain ordering shifts vs upstream small models**: Phonetics/Phonology (0.435) and Morphology (0.476) hold up far better here than for any upstream open model (Phonetics ≤0.31 across all 18 upstream baselines). Syntax (0.647) and Semantics (0.623) lead.
- **Isolated weakness**: `Deixis & Reference` subclass = 0.059 (1/17) — 6/17 responses had no extractable answer, the rest scattered with no systematic pattern. Appears to be a genuine, specific deixis/reference-resolution gap, not an extraction artifact.

## Final thoughts

Local model's improvements are exciting! Also Upstage, an Korean company said they are planning to release Solar Mini 4 which is a 35B A3B model. Definitly going to test that, so stay tuned!

```
@misc{shin2025kobaltkoreanbenchmarkadvanced,
  title={KoBALT: Korean Benchmark For
         Advanced Linguistic Tasks},
  author={Hyopil Shin and Sangah Lee and
          Dongjun Jang and Wooseok Song and
          others},
  year={2025},
  eprint={2505.16125},
  archivePrefix={arXiv},
  url={https://arxiv.org/abs/2505.16125}
}
```
