var sQ = (function(){

    function SelfQuery(query){
        this.content = SelfQuery._kindOf(query);
        this.length = (this.content) ? this.content.length : null;
    }
    
    /* check to see if parameter is an NodeList */
    SelfQuery._isNodeList = function(query){
        return NodeList.prototype.isPrototypeOf(query);
    }
    
    /* checks for DOM Element */
    SelfQuery._isElement = function(query){
        return query instanceof Element;
    }
    
    /* check for array of DOM Elements */
    SelfQuery._isArrayOfElements = function(query){
        if(!Array.isArray(query)){
            return false;
        }
        query.forEach(function(el){
            if(!SelfQuery._isElement(el)){
                return false;
            }
        });
        return true;
    }
    
    /* if query is string then Query for Element/s */
    SelfQuery._searchFor = function(query){
        let el_nodes = document.querySelectorAll(query);
        let el_array = Array.from(el_nodes);
    
        if(el_array.length === 0){
            return null;
        }
        else{
            return el_array;
        }
    }
    
    SelfQuery._kindOf = function(query){
        if(typeof(query) === 'string'){
            return SelfQuery._searchFor(query);
        }
        else if(SelfQuery._isElement(query)){
            return [query];
        }
        else if(SelfQuery._isArrayOfElements(query)){
            return query;
        }
        else if(SelfQuery._isNodeList(query)){
            return Array.from(query);
        }
        else{
            return null;
        }
    }
    
    /* =========================================================== */
    
    /* get the Parent Node/s */
    SelfQuery.prototype.parent = function(index = 0){
        let parents = [];
    
        if(index >= 0){
            parents.push(this.content[index].parentNode);
        }
        else{
            this.content.forEach(function(el){
                parents.push(el.parentNode);
            })
        }
    
        return new SelfQuery(parents);
    }
    
    SelfQuery._classify = function(element){
        let arr = Array.from(element.classList);
        let clss = '';
        
        arr.forEach(function(el){
            clss += (el !== '') ? '.' + el : '';
        });
        
        return clss;
    }
    
    SelfQuery._objectifyNodeMap = function(element){
        let NodeMap = element.attributes;
        let obj = {};
        
        for (let i = 0; i < NodeMap.length; i++){
            obj[NodeMap[i].nodeName] = NodeMap[i].nodeValue;
        }
        
        return obj;
    }
    
    SelfQuery._info = function(element){
        if(!SelfQuery._isElement(element)){
            return { };
        }
        
        return {
            'tag': element.tagName,
            'class': SelfQuery._classify(element),
            'id': (element.id !== '') ? '#' + element.id : '',
            'attr': SelfQuery._objectifyNodeMap(element)
        }
    }
    
    SelfQuery.prototype.info = function(index = 0){
        if(index >= 0){
            return SelfQuery._info(this.content[index]);
        }
        else{
            let arr = [];
            
            this.content.forEach(function(e){
                arr.push(SelfQuery._info(e));    
            })
            
            return arr;
        }
    }
    
    SelfQuery.prototype.contains = function(query){
    }
    
    SelfQuery._buildFindQuery = function(INF){
        return INF.tag 
                      + ((INF.id !== '') ? INF.id : '') 
                      + ((INF.class !== '') ? INF.class : '');
    }
    
    SelfQuery.prototype.isNull = function(){
        return 
               (this.content === null
                        &&
               this.length === null);
    }
    
    //modify to accept node type
    //it looks ugly
    SelfQuery.prototype.find = function(query, index = -1){
        let self = this;
        
        function findOne(index, or = true){
            let QR, INF;
            
            INF = self.e(index);
            QR = INF.querySelectorAll(query);
            
            if(or){
                return new SelfQuery(QR);
            }
            else{
                return QR;
            }
        }
        
        if(index >= 0){
            return findOne(index);
        }
        else{
            let arr = [];
            
            this.content.forEach(function(el, i){
                let nel = findOne(i, false);
                
                for(let j = 0; j < nel.length; j++){
                    arr.push(nel[j]);
                }
                
            });
            
            return new SelfQuery(arr);
        }   
    }
    
    /* get the Children Node/s */
        
        /* IMPORTANT 
        -> IMPLEMENT isChildOf()
            return true + grade
            return false
        -> IMPLEMENT isParentOf()
            return true + grade
            return false
        -> MODIFY children()
            such that can get a children matching certain selector
        */
    
    SelfQuery.prototype.children = function(index = 0){
        let childs = [];
    
        if(index >= 0){  
            let temp_childs = this.content[index].childNodes;

            temp_childs.forEach(function(node){
                if(node.nodeType === 1 && node.nodeType !== 3){
                    childs.push(node);
                }
            });
        }
        else{
            /* MODIFY IN SUCH WAY THAT SelfQuery accept array of arrays of elements */
            this.content.forEach(function(el){
                el.childNodes.forEach(function(node){
                    if(node.nodeType === 1 && node.nodeType !== 3){
                        childs.push(node);
                    }
                });
            });
        }
    
        return new SelfQuery(childs);
    }
    
    /* get Siblings of Node/s */
    
        /* SMAE AS ABOVE */
    SelfQuery.prototype.siblings = function(index = 0){
        let parent, childs, skip, siblings = [];
    
        if(index >= 0){
            skip = this.content[index];
            parent = skip.parentNode;
            childs = parent.childNodes;
    
            childs.forEach(function(el){
                if(!el.isSameNode(skip)){
                    siblings.push(el);      
                }
            });
        }
        else{
            this.content.forEach(function(ep){
                skip = ep;
                parent = skip.parentNode;
                childs = parent.childNodes;
    
                childs.forEach(function(el){
                    if(!el.isSameNode(skip)){
                        siblings.push(el);      
                    }
                });
            });
        }
    
        return new SelfQuery(siblings);
    }
    
    
    /* ================================================================== */
    
    SelfQuery.prototype.first = function(){
        let first = this.content[0];
        return new SelfQuery(first);
    }
    
    SelfQuery.prototype.last = function(){
        let last = this.content[(this.content.length - 1)];
        return new SelfQuery(last);
    }
    
    SelfQuery.prototype.no = function(index = 0){
        let sel = this.content[index];
        return new SelfQuery(sel);
    }

    SelfQuery.prototype.e = function(index = 0){
        return this.content[index];
    }
    
    /* ================================================================== */
    
    
    /* create and append a child to the selected Element */
        /*
            attributes = {
                'attributeName' : 'attributeVal',
                ...
            }
        */
    
    SelfQuery.prototype.createChild = function(tag, attributes, index = 0, text = null){
        let element = document.createElement(tag);
    
        if(attributes){
            Object.keys(attributes).forEach(function(key){
                element.setAttribute(key, attributes[key]);
            });
        }
    
        if(element.getAttribute('id') === null){
            element.removeAttribute('id');
        }

        if(text){
            element.textContent = text;
        }

        console.log(this.content[index]);

        this.content[index].appendChild(element);
    
        return this;
    }
    
    SelfQuery.prototype.appendChild = function(elements, index = 0){
        let arrayOfChilds = [];
        let ok = true;
    
        if(SelfQuery._isElement(elements)){
            arrayOfChilds[0] = elements;
        }
        else if(SelfQuery._isArrayOfElements(elements)){
            arrayOfChilds = elements;
        }
        else if(SelfQuery._isNodeList(elements)){
            arrayOfChilds = Array.from(elements);
        }
        else{
            ok = false;
        }
    
        if(ok){
            self = this.content;
    
            arrayOfChilds.forEach(function(ch){
                self[index].appendChild(ch);
            });
        }
    
        return this;
    }
    
    
    SelfQuery.prototype.css = function(prop, val, index = -1){
    
        if(index >= 0){
            this.content[index].style[prop] = val;
        }
        else{
            this.content.forEach(function(el){
                el.style[prop] = val;
            });
        }
    
        return this;
    }
    
        /*
            styles = {
                'styleName' : 'styleVal',
                ...
            }
        */
    
    SelfQuery.prototype.jcss = function(styles, index = 0){
        let self = this.content;
    
        if(index >= 0){
            Object.keys(styles).forEach(function(key){
                this.content[index].style[key] = styles[key];
            });
        }
        else{
            this.content.forEach(function(el){
                Object.keys(styles).forEach(function(key){
                    el.style[key] = styles[key];
                });
            });
        }
    
        return this;
    }

    SelfQuery.prototype.text = function(text, index = 0){
        if(index >= 0){
            this.content[index].textContent = text;
        }
        else{
            this.content.forEach(function(el){
                el.textContent = text;
            })
        }

        return this;
    }
    
    SelfQuery.prototype.addClass = function(classList, index = 0){
        let tempClass = classList.split(' ');
        let self = this;
        
        if(index >= 0){
            tempClass.forEach(function(cls){
               self.content[index].classList.add(cls); 
            });
        }
        else{
            tempClass.forEach(function(cls){
               self.content.forEach(function(el){
                  el.classList.add(cls);  
               });
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.removeClass = function(classList, index = 0){
        let tempClass = classList.split(' ');
        let self = this;
        
        if(index >= 0){
            tempClass.forEach(function(cls){
               self.content[index].classList.remove(cls); 
            });
        }
        else{
            tempClass.forEach(function(cls){
               self.content.forEach(function(el){
                  el.classList.remove(cls);  
               });
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.toggleClass = function(cls){
        let self = this;
        if(index >= 0){
           self.content[index].classList.toggle(cls); 
        }
        else{
           self.content.forEach(function(el){
              el.classList.toggle(cls);  
            });
        }
        
        return this;
    }

    SelfQuery.prototype.each = function(callback){
        for(let i = 0; i < this.content.length; i++){
            let el = new SelfQuery(this.content[i]);
            callback(el, i, this);
        }

        return this;
    }

    return function(query){
        return new SelfQuery(query);
    }

})();