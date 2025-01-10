from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools

web_agent = Agent(
    name="Web Agent",
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[DuckDuckGo()],
    instructions=["Always include sources"],
    show_tool_calls=True,
    markdown=True,
)


finance_agent = Agent(
    name="Finance Agent",
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True, company_news=True)],
    instructions=["Use tables to display data"],
    show_tool_calls=True,
    markdown=True,
)

multi_ai_agent = Agent(
    team = [web_agent,finance_agent],
    instructions=["Always include the sources" , "Use table to display the data"],
    show_tool_calls=True,
    markdown=True,
)

multi_ai_agent.print_response("Summarize the web recommendation and store the latest news for amazon", stream=True)