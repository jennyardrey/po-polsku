"""Check every new noun example and drill option against supplied PoliMorf tags."""
import gzip
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
LESSONS = json.loads((ROOT / "noun-endings.json").read_text())
DRILLS = json.loads((ROOT / "ending-drills.json").read_text())
FEEDBACK = json.loads((ROOT / "case-feedback.json").read_text())
QUESTION_LEMMAS = {question["lemma"].casefold() for question in json.loads((ROOT / "practice-questions.json").read_text())}
CASE_TAG = {"nominative": "nom", "genitive": "gen", "dative": "dat", "accusative": "acc", "instrumental": "inst", "locative": "loc", "vocative": "voc"}
PAIR = re.compile(r"([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+)\s*→\s*([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+)")

needed = {(example["lemma"].casefold(), example["form"].casefold()) for lesson in LESSONS.values() for example in lesson["comparisons"]}
needed |= {(drill["lemma"].casefold(), form.casefold()) for drill in DRILLS for form in drill["options"]}
for content in [LESSONS, DRILLS, FEEDBACK]:
    for lemma, form in PAIR.findall(json.dumps(content, ensure_ascii=False)):
        if lemma.casefold() in QUESTION_LEMMAS:
            needed.add((lemma.casefold(), form.casefold()))

found = {pair: set() for pair in needed}
with gzip.open(ROOT / "polimorf-20261018.tab.gz", "rt") as source:
    for line in source:
        if "\t" not in line:
            continue
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 3:
            continue
        pair = (parts[1].casefold(), parts[0].casefold())
        if pair in found and parts[2].startswith("subst:"):
            found[pair].add(parts[2])

errors = []
for pair, tags in found.items():
    if not tags:
        errors.append(f"Unattested noun pair: {pair}")

def matches(tags, case, number):
    abbreviation = CASE_TAG[case]
    return any(len(parts := tag.split(":")) > 2 and parts[1] == ("sg" if number == "singular" else "pl") and abbreviation in parts[2].split(".") for tag in tags)

for case, lesson in LESSONS.items():
    for example in lesson["comparisons"]:
        pair = (example["lemma"].casefold(), example["form"].casefold())
        if not matches(found[pair], case, example["number"]):
            errors.append(f"Wrong case tag in lesson {case}: {pair} ({example['number']})")

for drill in DRILLS:
    pair = (drill["lemma"].casefold(), drill["answer"].casefold())
    if not matches(found[pair], drill["case"], drill["number"]):
        errors.append(f"Wrong answer case tag: {drill['id']} {pair}")
    for option in drill["options"]:
        if option == drill["answer"]:
            continue
        candidate = (drill["lemma"].casefold(), option.casefold())
        if matches(found[candidate], drill["case"], drill["number"]):
            errors.append(f"Ambiguous option: {drill['id']} {option}")

if errors:
    raise SystemExit("\n".join(errors))
print(f"PASS: {len(LESSONS)} case ending lessons, {len(DRILLS)} ending drills, {len(found)} dictionary-attested lemma/form pairs")
