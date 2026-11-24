import json, pathlib, collections
p=pathlib.Path(__file__).parent
read=lambda n:json.loads((p/n).read_text(encoding="utf-8"))
v=read("core-vocabulary-100.json"); q=read("practice-questions.json"); c=read("cases.json"); verbs=read("verb-teaching-tables.json")
assert len(v)==100 and [x["rank"] for x in v]==list(range(1,101))
assert len({x["lemma"] for x in v})==100
assert all(x.get("meaning") for x in v)
assert len(c)==7 and len(q)==112 and len({x["id"] for x in q})==112
assert all(x["case"] in {z["id"] for z in c} for x in q)
assert all(x["polish"][x["targetSpan"]["start"]:x["targetSpan"]["end"]].casefold()==x["target"].casefold() for x in q)
assert all(x["target"] in x["acceptedAnswers"] and x["whyCase"] and x["whyForm"] for x in q)
assert len(verbs)==10 and all(x["simpleFinite"] for x in verbs)
print("PASS: 100 ranked words, 10 verb tables, 7 cases, 112 answerable case questions")
