import sys
sys.path.append('G:\okiru\app builder\RezStackFinal2\RezStackFinal/src')
from rezonic_swarm.simple_swarm import SwarmClient

class RezStackTrainerConnector:
    def __init__(self):
        self.swarm = SwarmClient('http://localhost:8000')
    
    def deploy_model_to_swarm(self, model_name):
        """Make trained model available to Swarm"""
        return self.swarm.register_model(model_name)
    
    def train_with_swarm_data(self, dataset):
        """Use Swarm's distributed data for training"""
        return self.swarm.request_training_data(dataset)
