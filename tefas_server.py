from flask import Flask, jsonify
from pytefas import Crawler
from datetime import date, timedelta

app = Flask(__name__)
tefas = Crawler()

def get_last_weekday():
    d = date.today()
    while d.weekday() >= 5:
        d -= timedelta(days=1)
    return d.strftime("%Y-%m-%d")

@app.route("/tefas/funds")
def funds():
    try:
        last_day = get_last_weekday()
        df = tefas.fetch(last_day, columns="info", kind="YAT")
        if df.empty:
            d = date.fromisoformat(last_day) - timedelta(days=1)
            while d.weekday() >= 5:
                d -= timedelta(days=1)
            df = tefas.fetch(d.strftime("%Y-%m-%d"), columns="info", kind="YAT")
        records = df.to_dict(orient="records")
        for r in records:
            for k, v in r.items():
                if hasattr(v, 'item'):
                    r[k] = v.item()
                elif v != v:
                    r[k] = None
        return jsonify({"data": records})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/tefas/fund/<code>")
def fund_detail(code):
    try:
        last_day = get_last_weekday()
        df = tefas.fetch(last_day, columns="info", kind="YAT")
        if not df.empty:
            row = df[df["fund_code"] == code.upper()]
            if not row.empty:
                records = row.to_dict(orient="records")
                for r in records:
                    for k, v in r.items():
                        if hasattr(v, 'item'):
                            r[k] = v.item()
                        elif v != v:
                            r[k] = None
                return jsonify({"data": records})
        return jsonify({"data": []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)