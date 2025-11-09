import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DependencyMap = ({ objectives, onDependencyUpdate }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const mapRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (mapRef?.current) {
      const rect = mapRef?.current?.getBoundingClientRect();
      setMapDimensions({ width: rect?.width, height: rect?.height });
    }
  }, []);

  const getNodePosition = (index, total) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const spacing = 200;
    
    return {
      x: 100 + col * spacing,
      y: 100 + row * spacing
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'border-success bg-success/10';
      case 'in-progress': return 'border-primary bg-primary/10';
      case 'at-risk': return 'border-warning bg-warning/10';
      case 'overdue': return 'border-error bg-error/10';
      default: return 'border-muted bg-muted/10';
    }
  };

  const handleNodeClick = (objective) => {
    if (isCreatingConnection) {
      if (!connectionStart) {
        setConnectionStart(objective);
      } else if (connectionStart?.id !== objective?.id) {
        // Create dependency
        onDependencyUpdate(connectionStart?.id, objective?.id);
        setConnectionStart(null);
        setIsCreatingConnection(false);
      }
    } else {
      setSelectedNode(selectedNode === objective?.id ? null : objective?.id);
    }
  };

  const renderConnectionLines = () => {
    const lines = [];
    
    objectives?.forEach((objective, index) => {
      if (objective?.dependencies) {
        objective?.dependencies?.forEach(depId => {
          const depIndex = objectives?.findIndex(obj => obj?.id === depId);
          if (depIndex !== -1) {
            const startPos = getNodePosition(depIndex, objectives?.length);
            const endPos = getNodePosition(index, objectives?.length);
            
            lines?.push(
              <line
                key={`${depId}-${objective?.id}`}
                x1={startPos?.x + 75}
                y1={startPos?.y + 40}
                x2={endPos?.x + 75}
                y2={endPos?.y + 40}
                stroke="var(--color-primary)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="opacity-60"
              />
            );
          }
        });
      }
    });
    
    return lines;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="GitBranch" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Dependency Map</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isCreatingConnection ? "default" : "outline"}
              size="sm"
              iconName="Link"
              iconPosition="left"
              onClick={() => {
                setIsCreatingConnection(!isCreatingConnection);
                setConnectionStart(null);
              }}
            >
              {isCreatingConnection ? 'Cancel Connection' : 'Add Dependency'}
            </Button>
            <Button variant="outline" size="sm" iconName="RotateCcw">
              Reset View
            </Button>
          </div>
        </div>
        
        {isCreatingConnection && (
          <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Icon name="Info" size={16} />
              <span>
                {!connectionStart 
                  ? 'Click on the first objective to start creating a dependency' :'Click on the second objective to complete the dependency connection'
                }
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Dependency Map */}
      <div className="p-6">
        <div 
          ref={mapRef}
          className="relative bg-muted/10 rounded-lg border-2 border-dashed border-muted overflow-auto"
          style={{ minHeight: '600px', minWidth: '800px' }}
        >
          {/* SVG for connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="var(--color-primary)"
                />
              </marker>
            </defs>
            {renderConnectionLines()}
          </svg>

          {/* Objective Nodes */}
          {objectives?.map((objective, index) => {
            const position = getNodePosition(index, objectives?.length);
            const isSelected = selectedNode === objective?.id;
            const isConnectionTarget = isCreatingConnection && connectionStart?.id === objective?.id;
            
            return (
              <div
                key={objective?.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'
                } ${isConnectionTarget ? 'ring-2 ring-primary' : ''}`}
                style={{
                  left: `${position?.x}px`,
                  top: `${position?.y}px`,
                  zIndex: 2
                }}
                onClick={() => handleNodeClick(objective)}
              >
                <div className={`w-40 p-3 bg-card border-2 rounded-lg ${getStatusColor(objective?.status)} ${
                  isSelected ? 'border-primary' : ''
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                        {objective?.title}
                      </h4>
                      <div className="text-xs text-muted-foreground">
                        {objective?.department}
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      {objective?.owners?.slice(0, 2)?.map((owner, ownerIndex) => (
                        <div
                          key={ownerIndex}
                          className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border border-card"
                          title={owner?.name}
                        >
                          {owner?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-muted rounded-full h-1.5 mr-2">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${objective?.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {objective?.progress}%
                    </span>
                  </div>

                  {/* Dependency indicators */}
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="ArrowRight" size={10} />
                      <span>{objective?.dependencies?.length || 0} deps</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="ArrowLeft" size={10} />
                      <span>
                        {objectives?.filter(obj => 
                          obj?.dependencies?.includes(objective?.id)
                        )?.length} blocked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Connection preview line */}
          {isCreatingConnection && connectionStart && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
              <svg className="w-full h-full">
                <line
                  x1={getNodePosition(objectives?.findIndex(obj => obj?.id === connectionStart?.id), objectives?.length)?.x + 75}
                  y1={getNodePosition(objectives?.findIndex(obj => obj?.id === connectionStart?.id), objectives?.length)?.y + 40}
                  x2={getNodePosition(objectives?.findIndex(obj => obj?.id === connectionStart?.id), objectives?.length)?.x + 75}
                  y2={getNodePosition(objectives?.findIndex(obj => obj?.id === connectionStart?.id), objectives?.length)?.y + 40}
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="opacity-60"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      {/* Selected Node Details */}
      {selectedNode && (
        <div className="border-t border-border p-4 bg-muted/20">
          {(() => {
            const selected = objectives?.find(obj => obj?.id === selectedNode);
            return (
              <div>
                <h4 className="font-medium text-foreground mb-2">{selected?.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Dependencies:</span>
                    <div className="mt-1">
                      {selected?.dependencies && selected?.dependencies?.length > 0 ? (
                        selected?.dependencies?.map(depId => {
                          const dep = objectives?.find(obj => obj?.id === depId);
                          return dep ? (
                            <div key={depId} className="text-foreground">{dep?.title}</div>
                          ) : null;
                        })
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blocking:</span>
                    <div className="mt-1">
                      {(() => {
                        const blocking = objectives?.filter(obj => 
                          obj?.dependencies?.includes(selectedNode)
                        );
                        return blocking?.length > 0 ? (
                          blocking?.map(obj => (
                            <div key={obj?.id} className="text-foreground">{obj?.title}</div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Critical Path:</span>
                    <div className="mt-1">
                      <span className="text-foreground">
                        {selected?.criticalPath ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default DependencyMap;