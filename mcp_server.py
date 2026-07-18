import sys
import json
import traceback

# Default parameters matching Calculator.jsx base preset
DEFAULT_PARAMS = {
    "initialBuses": 10,
    "seedCapital": 1000000,
    "busGrowthRate": 40,
    "monthsPerPhase": 5,
    "cityExpansionMonth": 18,
    "etmCost": 20000,
    "tvCost": 8000,
    "installationCost": 2000,
    "ownerDeposit": 5000,
    "simCostPerBus": 299,
    "maintenancePerBus": 200,
    "serverCostPerBus": 50,
    "avgPassengersPerBus": 300,
    "digitalTicketPct": 20,
    "ticketCommission": 2,
    "ownerRevShare": 50,
    "appAdRPMD": 5,
    "teamSalary": 150000,
    "officeOther": 30000,
    "marketingBudget": 50000,
    "baseInfra": 15000,
    "horizonMonths": 48,
    "advertiserCount": 8,
    "adPlaysPerBrandPerDay": 60,
    "busRunningHours": 10,
    "videoAdPct": 60,
    "videoAdDuration": 20,
    "imageAdDuration": 7,
    "adTimeShare": 40,
    "videoCpmRate": 150,
    "imageCpmRate": 60
}

def run_simulation(v):
    # Merge input parameters with default values
    params = {**DEFAULT_PARAMS, **v}
    
    months = []
    buses = params["initialBuses"]
    cum_rev = 0
    cum_profit = 0
    cash = params["seedCapital"]
    break_even_month = None
    
    for m in range(1, int(params["horizonMonths"]) + 1):
        # 1. Bus Growth
        added_buses = 0
        if m > 1:
            if params["busGrowthRate"] > 0:
                rate = params["busGrowthRate"] / 100.0
                added_buses = buses * (rate / 12.0)
            if m == params["cityExpansionMonth"]:
                added_buses += 20
        buses += added_buses
        
        # 2. Revenues
        ticket_rev = buses * params["avgPassengersPerBus"] * 30 * (params["digitalTicketPct"] / 100.0) * 15 * (params["ticketCommission"] / 100.0)
        
        weighted_avg_dur = (params["videoAdPct"] / 100.0) * params["videoAdDuration"] + ((100.0 - params["videoAdPct"]) / 100.0) * params["imageAdDuration"]
        max_cap = round((params["busRunningHours"] * 3600 * (params["adTimeShare"] / 100.0)) / (weighted_avg_dur or 15))
        demanded = params["advertiserCount"] * params["adPlaysPerBrandPerDay"]
        actual_plays = min(max_cap, demanded)
        
        blended_cpm = (params["videoAdPct"] / 100.0) * params["videoCpmRate"] + ((100.0 - params["videoAdPct"]) / 100.0) * params["imageCpmRate"]
        gross_rev_bus_month = (actual_plays * 30 * blended_cpm) / 1000.0
        tv_ad_rev_gross = buses * gross_rev_bus_month
        
        owner_payout = tv_ad_rev_gross * (params["ownerRevShare"] / 100.0)
        tv_ad_rev = tv_ad_rev_gross - owner_payout
        
        app_ad_rev = buses * 30 * params["appAdRPMD"]
        event_rev = buses * 1000.0
        
        total_rev = ticket_rev + tv_ad_rev + app_ad_rev + event_rev
        
        # 3. Costs
        net_capex_per_bus = max(0, params["etmCost"] + params["tvCost"] + params["installationCost"] - params["ownerDeposit"])
        capex = added_buses * net_capex_per_bus
        
        bus_opex = buses * (params["simCostPerBus"] + params["maintenancePerBus"] + params["serverCostPerBus"])
        
        if buses < 50:
            fixed_opex = params["teamSalary"] + params["officeOther"] + params["marketingBudget"] + params["baseInfra"]
        elif buses < 200:
            fixed_opex = (params["teamSalary"] * 1.8) + (params["officeOther"] * 1.5) + (params["marketingBudget"] * 2.0) + (params["baseInfra"] * 1.5)
        else:
            fixed_opex = (params["teamSalary"] * 3.5) + (params["officeOther"] * 2.5) + (params["marketingBudget"] * 4.0) + (params["baseInfra"] * 3.0)
            
        total_opex = bus_opex + fixed_opex + capex
        profit = total_rev - total_opex
        
        cum_rev += total_rev
        cum_profit += profit
        cash += profit
        
        if profit >= 0 and break_even_month is None:
            break_even_month = m
            
        months.append({
            "month": f"M{m}",
            "buses": round(buses, 1),
            "ticketRev": round(ticket_rev),
            "tvAdRev": round(tv_ad_rev),
            "appAdRev": round(app_ad_rev),
            "eventRev": round(event_rev),
            "totalRev": round(total_rev),
            "capex": round(capex),
            "busOpex": round(bus_opex),
            "fixedOpex": round(fixed_opex),
            "totalOpex": round(total_opex),
            "ownerPayout": round(owner_payout),
            "profit": round(profit),
            "cumRev": round(cum_rev),
            "cumProfit": round(cum_profit),
            "cash": round(cash),
            "arpu": round(total_rev / buses) if buses > 0 else 0,
            "margin": round((profit / total_rev) * 100) if total_rev > 0 else 0
        })
        
    return {
        "breakEvenMonth": break_even_month,
        "cumulativeCapex": round(sum(m["capex"] for m in months)),
        "finalBuses": round(buses),
        "finalMonthlyRevenue": round(months[-1]["totalRev"]),
        "finalMonthlyProfit": round(months[-1]["profit"]),
        "finalCash": round(cash),
        "netCapexPerBus": net_capex_per_bus,
        "firstMonthARPU": months[0]["arpu"],
        "finalMonthARPU": months[-1]["arpu"]
    }

def optimize_params(goal, constraints):
    # Grid-search key scaling variables to optimize a specific target:
    # goal: 'max_profit', 'max_cash', 'max_arr', 'min_payback'
    # constraints: e.g. {"max_owner_rev_share": 50}
    
    best_val = -float('inf') if goal != 'min_payback' else float('inf')
    best_config = {}
    
    # Define optimization ranges
    rev_shares = [30, 40, 50, 60]
    growth_rates = [20, 40, 60, 80]
    ad_shares = [20, 30, 40, 50]
    ad_counts = [5, 8, 12, 16, 20]
    
    for rs in rev_shares:
        for gr in growth_rates:
            for ads in ad_shares:
                for ac in ad_counts:
                    config = {
                        "ownerRevShare": rs,
                        "busGrowthRate": gr,
                        "adTimeShare": ads,
                        "advertiserCount": ac
                    }
                    
                    # Apply constraints
                    valid = True
                    for c_key, c_val in constraints.items():
                        if c_key == "max_owner_rev_share" and rs > c_val:
                            valid = False
                        if c_key == "max_growth_rate" and gr > c_val:
                            valid = False
                    
                    if not valid:
                        continue
                        
                    res = run_simulation(config)
                    
                    # Calculate score
                    if goal == "max_profit":
                        score = res["finalMonthlyProfit"]
                    elif goal == "max_cash":
                        score = res["finalCash"]
                    elif goal == "max_arr":
                        score = res["finalMonthlyRevenue"] * 12
                    elif goal == "min_payback":
                        score = res["breakEvenMonth"] if res["breakEvenMonth"] is not None else 999
                    else:
                        score = res["finalMonthlyProfit"]
                        
                    if goal == "min_payback":
                        if score < best_val:
                            best_val = score
                            best_config = {**config, "outcomes": res}
                    else:
                        if score > best_val:
                            best_val = score
                            best_config = {**config, "outcomes": res}
                            
    return {
        "best_config": best_config,
        "best_score": best_val,
        "goal": goal
    }

def send_response(response):
    sys.stdout.write(json.dumps(response) + "\n")
    sys.stdout.flush()

def main():
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            request = json.loads(line)
            method = request.get("method")
            req_id = request.get("id")
            
            # Handshake Initialize
            if method == "initialize":
                response = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {
                            "tools": {}
                        },
                        "serverInfo": {
                            "name": "getmybus-simulator",
                            "version": "1.0.0"
                        }
                    }
                }
                send_response(response)
                
            elif method == "initialized":
                # Notification
                pass
                
            # List tools
            elif method == "tools/list":
                response = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "tools": [
                            {
                                "name": "simulate",
                                "description": "Run a 48-month simulation for the GetMyBus fleet expansion business model. Takes a dictionary of parameter adjustments (e.g. initialBuses, busGrowthRate, ownerRevShare, videoCpmRate) and returns computed projection details.",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "initialBuses": {"type": "number", "description": "Starting fleet count"},
                                        "seedCapital": {"type": "number", "description": "Initial reserve capital in Rupees"},
                                        "busGrowthRate": {"type": "number", "description": "Annual fleet growth percentage"},
                                        "ownerRevShare": {"type": "number", "description": "Percentage of ad revenue shared with bus owners"},
                                        "videoCpmRate": {"type": "number", "description": "CPM rate charged for video ads in Rupees"},
                                        "imageCpmRate": {"type": "number", "description": "CPM rate charged for image ads in Rupees"},
                                        "advertiserCount": {"type": "number", "description": "Number of active ad brands in network"},
                                        "adPlaysPerBrandPerDay": {"type": "number", "description": "Plays per brand daily per bus"},
                                        "adTimeShare": {"type": "number", "description": "Percentage of screen time allocated to ads"}
                                    }
                                }
                            },
                            {
                                "name": "optimize",
                                "description": "Runs a grid-search optimization simulation over parameter variations to find the configuration that maximizes or minimizes a target business metric.",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "goal": {
                                            "type": "string",
                                            "enum": ["max_profit", "max_cash", "max_arr", "min_payback"],
                                            "description": "The optimization goal target"
                                        },
                                        "constraints": {
                                            "type": "object",
                                            "description": "Additional optimization constraints (e.g. max_owner_rev_share)"
                                        }
                                    },
                                    "required": ["goal"]
                                }
                            }
                        ]
                    }
                }
                send_response(response)
                
            # Call tools
            elif method == "tools/call":
                params = request.get("params", {})
                name = params.get("name")
                arguments = params.get("arguments", {})
                
                if name == "simulate":
                    result = run_simulation(arguments)
                    url_params = "&".join([f"{k}={v}" for k, v in arguments.items()])
                    dashboard_url = f"https://www.getmybus.in/admin?{url_params}"
                    response_text = f"--- SIMULATION RESULTS ---\n{json.dumps(result, indent=2)}\n\n🔗 View and adjust these parameters interactively on the live dashboard: {dashboard_url}"
                    response = {
                        "jsonrpc": "2.0",
                        "id": req_id,
                        "result": {
                            "content": [
                                {
                                    "type": "text",
                                    "text": response_text
                                }
                            ]
                        }
                    }
                elif name == "optimize":
                    goal = arguments.get("goal")
                    constraints = arguments.get("constraints", {})
                    result = optimize_params(goal, constraints)
                    
                    best_config = result.get("best_config", {})
                    best_params = {k: v for k, v in best_config.items() if k != "outcomes"}
                    url_params = "&".join([f"{k}={v}" for k, v in best_params.items()])
                    dashboard_url = f"https://www.getmybus.in/admin?{url_params}"
                    response_text = f"--- OPTIMIZATION RESULTS ---\n{json.dumps(result, indent=2)}\n\n🔗 View and adjust these parameters interactively on the live dashboard: {dashboard_url}"
                    response = {
                        "jsonrpc": "2.0",
                        "id": req_id,
                        "result": {
                            "content": [
                                {
                                    "type": "text",
                                    "text": response_text
                                }
                            ]
                        }
                    }
                else:
                    response = {
                        "jsonrpc": "2.0",
                        "id": req_id,
                        "error": {
                            "code": -32601,
                            "message": f"Tool {name} not found"
                        }
                    }
                send_response(response)
                
            else:
                response = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {}
                }
                send_response(response)
                
        except Exception as e:
            # Output traceback to stderr for client debugging
            sys.stderr.write(traceback.format_exc())
            sys.stderr.flush()

if __name__ == "__main__":
    main()
