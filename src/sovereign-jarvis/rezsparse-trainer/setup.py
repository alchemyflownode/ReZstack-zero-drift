from setuptools import setup, find_packages

setup(
    name="rezstack",
    version="2.0.0",
    description="Constitutional RezStack v2.0 - Constitutional AI Safety Layer",
    author="AlchemyFlowNode",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "pydantic>=2.5.0",
        "python-multipart>=0.0.6",
        "numpy>=1.24.0",
        "pandas>=2.1.0",
        "requests>=2.31.0",
    ],
    extras_require={
        "ui": ["streamlit>=1.28.0", "plotly>=5.17.0"],
        "ml": ["torch>=2.1.0", "transformers>=4.35.0", "scikit-learn>=1.3.0"],
        "full": [
            "streamlit>=1.28.0",
            "plotly>=5.17.0",
            "torch>=2.1.0",
            "transformers>=4.35.0",
            "scikit-learn>=1.3.0",
            "prometheus-client>=0.18.0",
            "redis>=5.0.0"
        ]
    },
    entry_points={
        "console_scripts": [
            "rezstack-cli=rezstack.elite_interface.simple_cli:main",
        ],
    },
    python_requires=">=3.9",
)
